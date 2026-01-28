
import { BillShareDataSource } from "../src/infrastructure/config/bill-share-data-source";
import { ExpenseGroupService } from "../src/application/services/expense-group.service";
import { SplitMode } from "../src/domain/strategies/split-strategy";
import { ExpenseStrategyInput } from "../src/infrastructure/database/entities/expense-strategy-input.entity";

async function verifyPersistence() {
    try {
        await BillShareDataSource.initialize();
        console.log("Database connected.");

        const service = new ExpenseGroupService();

        // 1. Create Group
        console.log("Creating group...");
        const group = await service.createGroup("DB Verify Group", "TWD", { userId: "tester", name: "Tester" });
        const memberA = group.members.find(m => m.guest_name === "Tester")!;
        const memberB = await service.addMember(group.id, "MemberB");

        // 2. Test PERCENTAGE Persistence
        console.log("\nTesting PERCENTAGE persistence...");
        const splitDataPct = {
            [memberA.id]: 60,
            [memberB.id]: 40
        };
        const expensePct = await service.addExpense(
            group.id,
            memberA.id,
            100,
            "Percentage Expense",
            [],
            'GENERAL',
            SplitMode.PERCENTAGE,
            splitDataPct
        );
        console.log("Expense created (Percentage). ID:", expensePct.id);

        // Verify Allocations (Strategy Input)
        const inputsPct = await BillShareDataSource.getRepository(ExpenseStrategyInput).find({
            where: { expense: { id: expensePct.id } }
        });
        console.log("Inputs found:", inputsPct.length);
        if (inputsPct.length !== 2) throw new Error("Expected 2 inputs");
        const allocA = inputsPct.find(a => a.member_id === memberA.id);
        if (allocA?.value !== 60) throw new Error(`Expected AllocA value 60, got ${allocA?.value}`);
        if (allocA?.type !== 'PERCENTAGE') throw new Error(`Expected type PERCENTAGE, got ${allocA?.type}`);
        console.log("Percentage persistence Verified!");

        // 3. Test ITEMIZED Persistence
        console.log("\nTesting ITEMIZED persistence...");
        const splitDataItems = {
            items: [
                { memberId: memberA.id, amount: 200, name: "Beef" },
                { memberId: memberB.id, amount: 300, name: "Pork" }
            ]
        };
        // Total 500
        const expenseItems = await service.addExpense(
            group.id,
            memberA.id,
            500,
            "Itemized Expense",
            [],
            'GENERAL',
            SplitMode.ITEMIZED,
            splitDataItems
        );
        console.log("Expense created (Itemized). ID:", expenseItems.id);

        // Verify Items (Strategy Input)
        const inputsItems = await BillShareDataSource.getRepository(ExpenseStrategyInput).find({
            where: { expense: { id: expenseItems.id } }
        });
        console.log("Inputs found:", inputsItems.length);
        if (inputsItems.length !== 2) throw new Error("Expected 2 inputs");
        const itemBeef = inputsItems.find(i => i.name === "Beef");
        if (itemBeef?.value !== 200) throw new Error("Beef item value mismatch");
        if (itemBeef?.type !== 'ITEMIZED') throw new Error(`Expected type ITEMIZED, got ${itemBeef?.type}`);
        console.log("Itemized persistence Verified!");

        // Clean up
        await service.deleteGroup(group.id);
        console.log("\nCleanup done.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await BillShareDataSource.destroy();
    }
}

verifyPersistence();

import "reflect-metadata";
import { AppDataSource } from "../src/infrastructure/config/data-source";
import { User } from "../src/infrastructure/database/entities/user.entity";
import { ExpenseGroup } from "../src/infrastructure/database/entities/expense-group.entity";
import { GroupMember } from "../src/infrastructure/database/entities/group-member.entity";
import { Expense } from "../src/infrastructure/database/entities/expense.entity";
import { ExpenseSplit } from "../src/infrastructure/database/entities/expense-split.entity";
import { v4 as uuidv4 } from 'uuid';

async function seed() {
    try {
        await AppDataSource.initialize();
        console.log("Database connected for seeding...");

        const userRepository = AppDataSource.getRepository(User);
        const groupRepository = AppDataSource.getRepository(ExpenseGroup);
        const memberRepository = AppDataSource.getRepository(GroupMember);
        const expenseRepository = AppDataSource.getRepository(Expense);
        // Splits are cascaded from Expense usually, but we can save them if needed. 
        // Expense entity has cascade: true for splits.

        // 1. Create User
        console.log("Seeding User...");
        let user = await userRepository.findOneBy({ email: "test@example.com" });
        if (!user) {
            user = new User();
            user.email = "test@example.com";
            user.name = "Test User";
            user.firebaseUid = "test-firebase-uid";
            user.isActive = true;
            await userRepository.save(user);
        }

        // 2. Create Group
        console.log("Seeding Group...");
        const group = new ExpenseGroup();
        group.name = "Taipei Trip 2026";
        group.currency = "TWD";
        group.icon = "🏙️";
        await groupRepository.save(group);

        // 3. Create Members
        console.log("Seeding Members...");

        // Member 1: The Registered User (Alice)
        const memberAlice = new GroupMember();
        memberAlice.group = group;
        memberAlice.user_id = user.id;
        memberAlice.guest_name = "Alice"; // Display name fallback
        memberAlice.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice";
        await memberRepository.save(memberAlice);

        // Member 2: Bob (Guest)
        const memberBob = new GroupMember();
        memberBob.group = group;
        memberBob.guest_name = "Bob";
        memberBob.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob";
        await memberRepository.save(memberBob);

        // Member 3: Charlie (Guest)
        const memberCharlie = new GroupMember();
        memberCharlie.group = group;
        memberCharlie.guest_name = "Charlie";
        memberCharlie.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie";
        await memberRepository.save(memberCharlie);

        // 4. Create Expenses
        console.log("Seeding Expenses...");

        // Expense 1: Alice paid 3000 for Hotel, split equally
        const expense1 = new Expense();
        expense1.group = group;
        expense1.payer = memberAlice; // Alice paid
        expense1.payer_member_id = memberAlice.id;
        expense1.amount = 3000;
        expense1.description = "Hotel Stay";
        expense1.date = new Date();
        expense1.category = "GENERAL";

        const split1a = new ExpenseSplit();
        split1a.member = memberAlice;
        split1a.amount = 1000;

        const split1b = new ExpenseSplit();
        split1b.member = memberBob;
        split1b.amount = 1000;

        const split1c = new ExpenseSplit();
        split1c.member = memberCharlie;
        split1c.amount = 1000;

        expense1.splits = [split1a, split1b, split1c];
        await expenseRepository.save(expense1);

        // Expense 2: Bob paid 600 for Dinner, split between Alice and Bob
        const expense2 = new Expense();
        expense2.group = group;
        expense2.payer = memberBob; // Bob paid
        expense2.payer_member_id = memberBob.id;
        expense2.amount = 600;
        expense2.description = "Dinner at Night Market";
        expense2.date = new Date();
        expense2.category = "GENERAL";

        const split2a = new ExpenseSplit();
        split2a.member = memberAlice;
        split2a.amount = 300;

        const split2b = new ExpenseSplit();
        split2b.member = memberBob;
        split2b.amount = 300;

        expense2.splits = [split2a, split2b];
        await expenseRepository.save(expense2);

        console.log("Seeding Completed Successfully!");
        console.log(`Group ID: ${group.id}`);

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();

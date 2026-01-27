
import {
    EqualSplitStrategy,
    ExactAmountStrategy,
    PercentageSplitStrategy,
    ItemizedSplitStrategy
} from '../src/domain/strategies/split-strategy';

const members = ['userA', 'userB', 'userC'];

console.log("=== Testing EqualSplitStrategy ===");
const equalStrategy = new EqualSplitStrategy();
try {
    const total = 100;
    const splits = equalStrategy.calculateSplits(total, members);
    console.log(`Total: ${total}, Splits:`, splits);
    // userA: 33.34, userB: 33.33, userC: 33.33 -> Sum 100
} catch (e: any) {
    console.error("Equal Split Failed:", e.message);
}

console.log("\n=== Testing PercentageSplitStrategy ===");
const percentStrategy = new PercentageSplitStrategy();
try {
    const total = 200;
    const data = { 'userA': 50, 'userB': 25, 'userC': 25 };
    percentStrategy.validate(total, members, data);
    const splits = percentStrategy.calculateSplits(total, members, data);
    console.log(`Total: ${total}, Data: ${JSON.stringify(data)}, Splits:`, splits);
} catch (e: any) {
    console.error("Percentage Split Failed:", e.message);
}

console.log("\n=== Testing ExactAmountStrategy ===");
const exactStrategy = new ExactAmountStrategy();
try {
    const total = 150;
    const data = { 'userA': 50, 'userB': 50, 'userC': 50 };
    exactStrategy.validate(total, members, data);
    const splits = exactStrategy.calculateSplits(total, members, data);
    console.log(`Total: ${total}, Data: ${JSON.stringify(data)}, Splits:`, splits);
} catch (e: any) {
    console.error("Exact Split Failed:", e.message);
}

console.log("\n=== Testing ExactAmountStrategy (Fail Case) ===");
try {
    const total = 150;
    const data = { 'userA': 50, 'userB': 50, 'userC': 40 }; // Sum 140 != 150
    exactStrategy.validate(total, members, data);
} catch (e: any) {
    console.log("Expected Validation Error:", e.message);
}

console.log("\n=== Testing ItemizedSplitStrategy ===");
const itemizedStrategy = new ItemizedSplitStrategy();
try {
    const total = 300;
    const data = {
        items: [
            { memberId: 'userA', amount: 100 },
            { memberId: 'userB', amount: 50 },
            { memberId: 'userB', amount: 50 }, // userB total 100
            { memberId: 'userC', amount: 100 }
        ]
    };
    itemizedStrategy.validate(total, members, data);
    const splits = itemizedStrategy.calculateSplits(total, members, data);
    console.log(`Total: ${total}, Splits:`, splits);
} catch (e: any) {
    console.error("Itemized Split Failed:", e.message);
}

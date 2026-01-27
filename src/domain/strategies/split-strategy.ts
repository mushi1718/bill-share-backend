export enum SplitMode {
    EQUAL = 'EQUAL',
    EXACT_AMOUNT = 'EXACT_AMOUNT',
    PERCENTAGE = 'PERCENTAGE',
    ITEMIZED = 'ITEMIZED'
}

export interface SplitResult {
    memberId: string;
    amount: number;
}

export interface ISplitStrategy {
    calculateSplits(totalAmount: number, members: string[], data?: any): SplitResult[];
    validate(totalAmount: number, members: string[], data?: any): void;
}

export class EqualSplitStrategy implements ISplitStrategy {
    calculateSplits(totalAmount: number, members: string[]): SplitResult[] {
        if (members.length === 0) return [];

        const count = members.length;
        const splitAmount = Math.floor((totalAmount / count) * 100) / 100;
        let remainder = Math.round((totalAmount - (splitAmount * count)) * 100) / 100;

        return members.map((memberId, index) => {
            let amount = splitAmount;
            if (index < Math.round(remainder * 100)) { // Distribute cents to first N members
                amount = Number((amount + 0.01).toFixed(2));
            }
            return { memberId, amount };
        });
    }

    validate(totalAmount: number, members: string[]): void {
        if (members.length === 0) throw new Error("At least one member is required for equal split.");
    }
}

export class ExactAmountStrategy implements ISplitStrategy {
    calculateSplits(totalAmount: number, members: string[], data: { [memberId: string]: number }): SplitResult[] {
        return Object.entries(data).map(([memberId, amount]) => ({
            memberId,
            amount: Number(amount)
        }));
    }

    validate(totalAmount: number, members: string[], data: { [memberId: string]: number }): void {
        const sum = Object.values(data).reduce((acc, val) => acc + Number(val), 0);
        // Allow small floating point error
        if (Math.abs(sum - totalAmount) > 0.01) {
            throw new Error(`Total split amount (${sum}) does not match expense amount (${totalAmount})`);
        }

        // Ensure all provided members exist in the group list (optional strict check)
        // const extraMembers = Object.keys(data).filter(id => !members.includes(id));
        // if (extraMembers.length > 0) throw new Error(`Unknown members in split data: ${extraMembers.join(', ')}`);
    }
}

export class PercentageSplitStrategy implements ISplitStrategy {
    calculateSplits(totalAmount: number, members: string[], data: { [memberId: string]: number }): SplitResult[] {
        return Object.entries(data).map(([memberId, percentage]) => ({
            memberId,
            amount: Number((totalAmount * (percentage / 100)).toFixed(2))
        }));
    }

    validate(totalAmount: number, members: string[], data: { [memberId: string]: number }): void {
        const totalPercent = Object.values(data).reduce((acc, val) => acc + Number(val), 0);
        if (Math.abs(totalPercent - 100) > 0.1) { // Tolerate small epsilon
            throw new Error(`Total percentage (${totalPercent}%) must be 100%`);
        }
    }
}

export class ItemizedSplitStrategy implements ISplitStrategy {
    calculateSplits(totalAmount: number, members: string[], data: { items: { memberId: string, amount: number }[] }): SplitResult[] {
        // Aggregate amounts per member
        const memberMap = new Map<string, number>();

        data.items.forEach(item => {
            const current = memberMap.get(item.memberId) || 0;
            memberMap.set(item.memberId, current + item.amount);
        });

        return Array.from(memberMap.entries()).map(([memberId, amount]) => ({
            memberId,
            amount: Number(amount.toFixed(2))
        }));
    }

    validate(totalAmount: number, members: string[], data: { items: { memberId: string, amount: number }[] }): void {
        const sum = data.items.reduce((acc, item) => acc + Number(item.amount), 0);
        if (Math.abs(sum - totalAmount) > 0.01) {
            throw new Error(`Total itemized amount (${sum}) does not match expense amount (${totalAmount})`);
        }
    }
}

export class SplitStrategyFactory {
    static getStrategy(mode: SplitMode): ISplitStrategy {
        switch (mode) {
            case SplitMode.EQUAL: return new EqualSplitStrategy();
            case SplitMode.EXACT_AMOUNT: return new ExactAmountStrategy();
            case SplitMode.PERCENTAGE: return new PercentageSplitStrategy();
            case SplitMode.ITEMIZED: return new ItemizedSplitStrategy();
            default: throw new Error(`Unknown split mode: ${mode}`);
        }
    }
}

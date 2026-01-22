import { Request, Response } from 'express';
import { BalanceService } from '../../application/services/balance.service';

export class BalanceController {
    private service: BalanceService;

    constructor() {
        this.service = new BalanceService();
    }

    /**
     * 取得群組餘額
     * GET /api/expense-groups/:id/balances
     */
    getGroupBalances = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const balances = await this.service.getGroupBalances(id);
            res.json({
                success: true,
                data: balances
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * 取得建議還款路徑 (含溯源資料)
     * GET /api/expense-groups/:id/settlements
     */
    getSettlements = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const settlements = await this.service.getOptimizedSettlements(id);
            res.json({
                success: true,
                data: settlements
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

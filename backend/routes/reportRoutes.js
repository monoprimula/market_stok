import express from 'express';
import verifyToken from '../middleware/auth.js';
import checkRole from '../middleware/roleCheck.js';
import ReportController from '../controllers/reportController.js';

const router = express.Router();


router.use(verifyToken, checkRole(['Admin']));


router.get('/stats', ReportController.getStats);

router.get('/export', ReportController.downloadGeneralReportCSV);

export default router;
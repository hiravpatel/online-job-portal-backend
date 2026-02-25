import { NotificationService } from '../../application/services/NotificationService';

export class NotificationCronService {
    private intervalRef: NodeJS.Timeout | null = null;
    private processing = false;

    constructor(
        private notificationService: NotificationService,
        private intervalMs: number = 60_000,
        private batchSize: number = 100
    ) { }

    start() {
        if (this.intervalRef) {
            return;
        }

        this.intervalRef = setInterval(async () => {
            if (this.processing) {
                return;
            }

            this.processing = true;
            try {
                const result = await this.notificationService.processPendingNotifications(this.batchSize);
                if (result.processed > 0 || result.failed > 0) {
                    console.log(
                        `[NotificationCron] processed=${result.processed} failed=${result.failed}`
                    );
                }
            } catch (error) {
                console.error('[NotificationCron] failed to process notifications:', error);
            } finally {
                this.processing = false;
            }
        }, this.intervalMs);

        console.log(`[NotificationCron] started. intervalMs=${this.intervalMs} batchSize=${this.batchSize}`);
    }

    stop() {
        if (!this.intervalRef) {
            return;
        }

        clearInterval(this.intervalRef);
        this.intervalRef = null;
        console.log('[NotificationCron] stopped');
    }
}

export type PayloadQueueFlushCallback<T> = (items: T[]) => void | Promise<void>;

export interface PayloadQueueOptions<T> {
    /**
     * The interval at which the queue should be flushed
     */
    flushTimeout?: number;

    /**
     * The callback function to call when items are flished
     * @param items The items that were flushed
     */
    onFlush: PayloadQueueFlushCallback<T>
}

export class PayloadQueue<T> {
    private queue: T[] = [];
    private options: Required<PayloadQueueOptions<T>>;
    private timeout?: NodeJS.Timeout;

    constructor(options: PayloadQueueOptions<T>) {
        this.options = {
            flushTimeout: 5000,
            ...options
        };
    }

    push(item: T) {
        this.queue.push(item);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.flush(), this.options.flushTimeout);
    }

    flush() {
        this.options.onFlush([...this.queue]);
        this.queue = [];
    }
}
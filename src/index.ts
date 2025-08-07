import { runInfiniteLoop } from "./run-infinite-loop";

runInfiniteLoop().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
import { runInfiniteLoop } from "./run-infinite-loop";

runInfiniteLoop().catch(error => {
    console.error('❌ Erro fatal no loop infinito:', error);
    process.exit(1);
});
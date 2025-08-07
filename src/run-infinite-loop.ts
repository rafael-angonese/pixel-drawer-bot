import { env } from "./env";
import { main } from "./main";

export const runInfiniteLoop = async () => {
    console.log(`🚀 Starting infinite loop execution`);
    console.log(`⏰ Configured interval: ${env.EXECUTION_INTERVAL_MINUTES} minutes`);
    
    let executionCount = 0;
    
    while (true) {
        executionCount++;
        console.log(`\n🔄 === EXECUTION #${executionCount} ===`);
        console.log(`📅 ${new Date().toLocaleString()}`);
        
        try {
            await main();
            console.log(`✅ Execution #${executionCount} completed successfully`);
        } catch (error) {
            console.error(`❌ Error in execution #${executionCount}:`, error);
        }
        
        console.log(`⏳ Waiting ${env.EXECUTION_INTERVAL_MINUTES} minutes until next execution...`);
        console.log(`⏰ Next execution: ${new Date(Date.now() + env.EXECUTION_INTERVAL_MINUTES * 60 * 1000).toLocaleString()}`);
        await new Promise(resolve => setTimeout(resolve, env.EXECUTION_INTERVAL_MINUTES * 60 * 1000));
    }
}

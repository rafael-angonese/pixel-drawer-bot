import { env } from "./env";
import { main } from "./main";

export const runInfiniteLoop = async () => {
    console.log(`🚀 Iniciando execução em loop infinito`);
    console.log(`⏰ Intervalo configurado: ${env.EXECUTION_INTERVAL_MINUTES} minutos`);
    
    let executionCount = 0;
    
    while (true) {
        executionCount++;
        console.log(`\n🔄 === EXECUÇÃO #${executionCount} ===`);
        console.log(`📅 ${new Date().toLocaleString()}`);
        
        try {
            await main();
            console.log(`✅ Execução #${executionCount} concluída com sucesso`);
        } catch (error) {
            console.error(`❌ Erro na execução #${executionCount}:`, error);
        }
        
        console.log(`⏳ Aguardando ${env.EXECUTION_INTERVAL_MINUTES} minutos até a próxima execução...`);
        console.log(`⏰ Próxima execução: ${new Date(Date.now() + env.EXECUTION_INTERVAL_MINUTES * 60 * 1000).toLocaleString()}`);
        await new Promise(resolve => setTimeout(resolve, env.EXECUTION_INTERVAL_MINUTES * 60 * 1000));
    }
}

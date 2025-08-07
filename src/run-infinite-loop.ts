import { main } from "./main";

const EXECUTION_INTERVAL_MINUTES = 15;


export const runInfiniteLoop = async () => {
    console.log(`🚀 Iniciando execução em loop infinito`);
    console.log(`⏰ Intervalo configurado: ${EXECUTION_INTERVAL_MINUTES} minutos`);
    
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
        
        console.log(`⏳ Aguardando ${EXECUTION_INTERVAL_MINUTES} minutos até a próxima execução...`);
        console.log(`⏰ Próxima execução: ${new Date(Date.now() + EXECUTION_INTERVAL_MINUTES * 60 * 1000).toLocaleString()}`);
        
        // Aguarda o intervalo configurado
        await new Promise(resolve => setTimeout(resolve, EXECUTION_INTERVAL_MINUTES * 60 * 1000));
    }
}

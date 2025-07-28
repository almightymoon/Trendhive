import { apiService } from '../services/apiService';
import cacheService from '../services/cacheService';

export const testCacheSystem = async () => {
  console.log('🧪 Testing Cache System...');
  
  try {
    // Test 1: Clear existing cache
    console.log('1️⃣ Clearing existing cache...');
    await cacheService.clear();
    
    // Test 2: Get cache info (should be 0)
    console.log('2️⃣ Getting cache info...');
    const initialInfo = await apiService.getCacheInfo();
    console.log('Initial cache size:', initialInfo.size);
    
    // Test 3: Fetch products (should cache)
    console.log('3️⃣ Fetching products (first time - should cache)...');
    const startTime1 = Date.now();
    const products1 = await apiService.getProducts();
    const endTime1 = Date.now();
    console.log(`Products fetched in ${endTime1 - startTime1}ms`);
    
    // Test 4: Fetch products again (should use cache)
    console.log('4️⃣ Fetching products (second time - should use cache)...');
    const startTime2 = Date.now();
    const products2 = await apiService.getProducts();
    const endTime2 = Date.now();
    console.log(`Products fetched in ${endTime2 - startTime2}ms`);
    
    // Test 5: Check cache info (should be > 0)
    console.log('5️⃣ Getting cache info after caching...');
    const finalInfo = await apiService.getCacheInfo();
    console.log('Final cache size:', finalInfo.size);
    
    // Test 6: Verify data consistency
    console.log('6️⃣ Verifying data consistency...');
    const isConsistent = JSON.stringify(products1) === JSON.stringify(products2);
    console.log('Data consistency:', isConsistent ? '✅ PASS' : '❌ FAIL');
    
    // Test 7: Performance comparison
    const timeDiff = (endTime2 - startTime2) - (endTime1 - startTime1);
    console.log(`7️⃣ Performance: Cache is ${Math.abs(timeDiff)}ms ${timeDiff < 0 ? 'faster' : 'slower'}`);
    
    console.log('🎉 Cache system test completed!');
    
    return {
      success: true,
      initialCacheSize: initialInfo.size,
      finalCacheSize: finalInfo.size,
      firstFetchTime: endTime1 - startTime1,
      secondFetchTime: endTime2 - startTime2,
      dataConsistent: isConsistent,
      performanceImprovement: timeDiff < 0
    };
    
  } catch (error) {
    console.error('❌ Cache system test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const clearCacheAndTest = async () => {
  console.log('🧹 Clearing cache and testing...');
  await cacheService.clear();
  return await testCacheSystem();
}; 
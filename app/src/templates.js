export const TEMPLATES = {
  python: `from collections import defaultdict

class Solution:
    def atMostK(self, nums, k):
        if k < 0:
            return 0
        counts = defaultdict(int)
        i = 0
        fin = 0
        for j in range(len(nums)):
            counts[nums[j]] += 1
            while len(counts) > k:
                counts[nums[i]] -= 1
                if counts[nums[i]] == 0:
                    del counts[nums[i]]
                i += 1
            fin += (j - i + 1)
        return fin

    def subarraysWithKDistinct(self, nums, k):
        return self.atMostK(nums, k) - self.atMostK(nums, k - 1)

sol = Solution()
print(sol.subarraysWithKDistinct([1, 2, 1, 2, 3], 2))   # Expected: 7
print(sol.subarraysWithKDistinct([1, 2, 1, 3, 4], 3))   # Expected: 3
`,

  cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int atMostK(vector<int>& nums, int k) {
        if (k < 0) return 0;
        unordered_map<int, int> counts;
        int i = 0, fin = 0;
        for (int j = 0; j < (int)nums.size(); j++) {
            counts[nums[j]]++;
            while ((int)counts.size() > k) {
                if (--counts[nums[i]] == 0) counts.erase(nums[i]);
                i++;
            }
            fin += (j - i + 1);
        }
        return fin;
    }

    int subarraysWithKDistinct(vector<int>& nums, int k) {
        return atMostK(nums, k) - atMostK(nums, k - 1);
    }
};

int main() {
    Solution sol;
    vector<int> a = {1, 2, 1, 2, 3};
    cout << sol.subarraysWithKDistinct(a, 2) << "\\n";  // Expected: 7

    vector<int> b = {1, 2, 1, 3, 4};
    cout << sol.subarraysWithKDistinct(b, 3) << "\\n";  // Expected: 3
    return 0;
}
`,
}

export const LANGUAGE_FOR_RUNTIME = {
  python: 'python',
  'cpp-jscpp': 'cpp',
  'cpp-wasm-clang': 'cpp',
}

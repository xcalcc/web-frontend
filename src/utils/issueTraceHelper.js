/**
 * A helper to determine if is multi-source or sink
 * @param issueArr
 */
const isMultiple = (issueArr, type = 'sink') => {
    try {
        //avoid using shift() and pop() here, even it is cloned by spread operator, which is shallow only!
        const LineNoArr = type === 'sink' ?
            issueArr.map(issue => issue.tracePath[issue.tracePath.length-1].lineNo) :
            issueArr.map(issue => issue.tracePath[0].lineNo);
        return !LineNoArr.every((val,idx,arr) => val === arr[0]);
    } catch (e) {
        console.error(e);
        return false;
    }
}

export default {
    isMultiple,
};

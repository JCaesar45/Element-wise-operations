function operation(op, matrix1, matrix2) {
    const operations = {
        'm_add': (a, b) => a + b,
        's_add': (a, b) => a + b,
        'm_sub': (a, b) => a - b,
        's_sub': (a, b) => a - b,
        'm_mult': (a, b) => a * b,
        's_mult': (a, b) => a * b,
        'm_div': (a, b) => a / b,
        's_div': (a, b) => a / b,
        'm_exp': (a, b) => Math.pow(a, b),
        's_exp': (a, b) => Math.pow(a, b)
    };
    
    const operationFunc = operations[op];
    if (!operationFunc) {
        throw new Error('Unknown operation: ' + op);
    }
    
    // Check if it's a scalar operation
    const isScalar = op.startsWith('s_');
    
    if (isScalar) {
        // Scalar operation
        const scalar = matrix2;
        return matrix1.map(row => row.map(val => operationFunc(val, scalar)));
    } else {
        // Matrix operation
        const rows = matrix1.length;
        const cols = matrix1[0].length;
        
        // Validate matrix dimensions
        if (rows !== matrix2.length || cols !== matrix2[0].length) {
            throw new Error('Matrices must have the same dimensions');
        }
        
        const result = [];
        for (let i = 0; i < rows; i++) {
            result[i] = [];
            for (let j = 0; j < cols; j++) {
                result[i][j] = operationFunc(matrix1[i][j], matrix2[i][j]);
            }
        }
        return result;
    }
}

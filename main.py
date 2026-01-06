def operation(op, matrix1, matrix2):
    operations = {
        'm_add': lambda a, b: a + b,
        's_add': lambda a, b: a + b,
        'm_sub': lambda a, b: a - b,
        's_sub': lambda a, b: a - b,
        'm_mult': lambda a, b: a * b,
        's_mult': lambda a, b: a * b,
        'm_div': lambda a, b: a / b,
        's_div': lambda a, b: a / b,
        'm_exp': lambda a, b: a ** b,
        's_exp': lambda a, b: a ** b
    }
    
    if op not in operations:
        raise ValueError(f"Unknown operation: {op}")
    
    operation_func = operations[op]
    
    # Check if it's a scalar operation
    is_scalar = op.startswith('s_')
    
    if is_scalar:
        # Scalar operation
        scalar = matrix2
        return [[operation_func(val, scalar) for val in row] for row in matrix1]
    else:
        # Matrix operation
        rows = len(matrix1)
        cols = len(matrix1[0])
        
        # Validate matrix dimensions
        if rows != len(matrix2) or cols != len(matrix2[0]):
            raise ValueError("Matrices must have the same dimensions")
        
        result = []
        for i in range(rows):
            result.append([])
            for j in range(cols):
                result[i].append(operation_func(matrix1[i][j], matrix2[i][j]))
        return result

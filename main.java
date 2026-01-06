import java.util.Arrays;

public class MatrixOperations {
    
    public static double[][] operation(String op, double[][] matrix1, double[][] matrix2) {
        switch (op) {
            case "m_add":
                return matrixOperation(matrix1, matrix2, (a, b) -> a + b);
            case "s_add":
                return scalarOperation(matrix1, matrix2[0][0], (a, b) -> a + b);
            case "m_sub":
                return matrixOperation(matrix1, matrix2, (a, b) -> a - b);
            case "s_sub":
                return scalarOperation(matrix1, matrix2[0][0], (a, b) -> a - b);
            case "m_mult":
                return matrixOperation(matrix1, matrix2, (a, b) -> a * b);
            case "s_mult":
                return scalarOperation(matrix1, matrix2[0][0], (a, b) -> a * b);
            case "m_div":
                return matrixOperation(matrix1, matrix2, (a, b) -> a / b);
            case "s_div":
                return scalarOperation(matrix1, matrix2[0][0], (a, b) -> a / b);
            case "m_exp":
                return matrixOperation(matrix1, matrix2, (a, b) -> Math.pow(a, b));
            case "s_exp":
                return scalarOperation(matrix1, matrix2[0][0], (a, b) -> Math.pow(a, b));
            default:
                throw new IllegalArgumentException("Unknown operation: " + op);
        }
    }
    
    private static double[][] matrixOperation(double[][] matrix1, double[][] matrix2, 
                                            java.util.function.DoubleBinaryOperator op) {
        int rows = matrix1.length;
        int cols = matrix1[0].length;
        
        // Validate matrix dimensions
        if (rows != matrix2.length || cols != matrix2[0].length) {
            throw new IllegalArgumentException("Matrices must have the same dimensions");
        }
        
        double[][] result = new double[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[i][j] = op.applyAsDouble(matrix1[i][j], matrix2[i][j]);
            }
        }
        return result;
    }
    
    private static double[][] scalarOperation(double[][] matrix, double scalar, 
                                            java.util.function.DoubleBinaryOperator op) {
        int rows = matrix.length;
        int cols = matrix[0].length;
        
        double[][] result = new double[rows][cols];
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                result[i][j] = op.applyAsDouble(matrix[i][j], scalar);
            }
        }
        return result;
    }
    
    // For scalar operations, we need to handle the scalar value properly
    public static double[][] operation(String op, double[][] matrix, double scalar) {
        switch (op) {
            case "s_add":
                return scalarOperation(matrix, scalar, (a, b) -> a + b);
            case "s_sub":
                return scalarOperation(matrix, scalar, (a, b) -> a - b);
            case "s_mult":
                return scalarOperation(matrix, scalar, (a, b) -> a * b);
            case "s_div":
                return scalarOperation(matrix, scalar, (a, b) -> a / b);
            case "s_exp":
                return scalarOperation(matrix, scalar, (a, b) -> Math.pow(a, b));
            default:
                throw new IllegalArgumentException("Unknown scalar operation: " + op);
        }
    }
}

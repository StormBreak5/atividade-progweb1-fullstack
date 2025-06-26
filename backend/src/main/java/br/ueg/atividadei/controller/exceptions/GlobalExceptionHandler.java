package br.ueg.atividadei.controller.exceptions;

import br.ueg.atividadei.service.exceptions.BusinessException;
import com.sun.jdi.InvocationException;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.lang.reflect.InvocationTargetException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e) {
        ErrorResponse errorResponse = new ErrorResponse(e.getCodeError(), e.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatusCode.valueOf(e.getCodeError()));
    }

    @Data
    public static class ErrorResponse {
        private int code;
        private String message;

        public ErrorResponse(int code, String message) {
            this.code = code;
            this.message = message;
        }
    }

    @ExceptionHandler({InvocationException.class, RuntimeException.class, Exception.class})
    public ResponseEntity<Object> handleException(final Throwable e) {
        ErrorResponse error = new ErrorResponse(500, e.getMessage());
        return new ResponseEntity<>(error, HttpStatusCode.valueOf(500));
    }
}

package br.ueg.atividadei.dto;

import lombok.Data;

@Data
public class LivroDataDTO {
    private String titulo;
    private String autor;
    private String isbn;
    private String editora;
    private String categoria;
    private java.time.LocalDate dataPublicacao;
}

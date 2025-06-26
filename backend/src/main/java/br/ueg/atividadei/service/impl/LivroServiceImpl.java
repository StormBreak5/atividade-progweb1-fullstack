package br.ueg.atividadei.service.impl;

import br.ueg.atividadei.model.Livro;
import br.ueg.atividadei.repository.LivroRepository;
import br.ueg.atividadei.service.LivroService;
import br.ueg.atividadei.service.exceptions.BusinessException;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LivroServiceImpl implements LivroService {

    @Autowired
    private LivroRepository repository;

    @Override
    public Livro save(Livro livro) {
        createValidation(livro);
        return repository.save(livro);
    }

    @Override
    public List<Livro> list() {
        return repository.findAll();
    }

    @Override
    public Optional<Livro> findById(Long id) {
        Optional<Livro> livro = repository.findById(id);

        if (Boolean.FALSE.equals(livro.isPresent())) {
            throw new BusinessException("Livro de id: " + id + " não encontrado", 404);
        } else {
            return repository.findById(id);
        }
    }

    @Override
    public ResponseEntity<Livro> update(Long id, Livro livroAtualizado) {
        return repository.findById(id).map(livroExistente -> {
            livroExistente.setTitulo(livroAtualizado.getTitulo());
            livroExistente.setAutor(livroAtualizado.getAutor());
            livroExistente.setEditora(livroAtualizado.getEditora());
            livroExistente.setIsbn(livroAtualizado.getIsbn());
            livroExistente.setCategoria(livroAtualizado.getCategoria());
            livroExistente.setDataPublicacao(livroAtualizado.getDataPublicacao());
            
            updateValidation(livroExistente);

            Livro livroSalvo = repository.save(livroExistente);
            return ResponseEntity.ok(livroSalvo);
        }).orElse(ResponseEntity.notFound().build());
    }

    @Override
    public Livro delete(Long id) {
        Livro livro = repository.findById(id).get();

        try {
            repository.delete(livro);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("O livro " + livro.getTitulo() + " não pôde ser removido por questões de integridade.");
        }

        return livro;
    }

    private void createValidation(Livro livro) {
        if (Strings.isEmpty(livro.getTitulo())) {
            throw new BusinessException("O titulo deve ser preenchido");
        } else if (Strings.isEmpty(livro.getAutor())) {
            throw new BusinessException("O autor deve ser preenchido");
        } else if (Strings.isEmpty(livro.getEditora())) {
            throw new BusinessException("A editora deve ser preenchida");
        } else if (Strings.isEmpty(livro.getCategoria())) {
            throw new BusinessException("Categoria deve ser preenchida");
        } else if (livro.getDataPublicacao() == null) {
            throw new BusinessException("A data de publicação não pode ser nula");
        } else if (livro.getDataPublicacao().isAfter(LocalDate.now())) {
            throw new BusinessException("A data de publicação não pode ser no futuro");
        }
    }

    private void updateValidation(Livro livro) {
        createValidation(livro);
    }
}

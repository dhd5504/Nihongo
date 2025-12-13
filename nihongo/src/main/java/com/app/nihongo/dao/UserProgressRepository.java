package com.app.nihongo.dao;

import com.app.nihongo.entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Integer> {
    Optional<UserProgress> findTopByUser_UserIdOrderByLesson_LessonIdDesc(Integer userId);
}

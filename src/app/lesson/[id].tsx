import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MODULES } from '@/constants/curriculum';
import { BADGES } from '@/constants/badges';
import { BitcoinColors } from '@/constants/theme';
import { useGame, triggerHaptic } from '@/context/GameContext';
import { QuizOption } from '@/types';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { completeLesson } = useGame();

  // Find the lesson across modules
  const currentModule = MODULES.find(m => m.lessons.some(l => l.id === id));
  const lesson = currentModule?.lessons.find(l => l.id === id);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Lição não encontrada</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const totalSteps = lesson.steps.length;
  const totalQuiz = lesson.quiz.length;
  const totalStages = totalSteps + totalQuiz;

  // Navigation stage: 0 to totalSteps - 1 (reading steps); totalSteps to totalStages - 1 (quiz)
  const [stageIndex, setStageIndex] = useState(0);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<QuizOption | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Completion state
  const [isCompleted, setIsCompleted] = useState(false);
  const [unlockedBadgesList, setUnlockedBadgesList] = useState<string[]>([]);
  const [spinsEarned, setSpinsEarned] = useState(1);

  const isReadingStep = stageIndex < totalSteps;
  const currentStep = isReadingStep ? lesson.steps[stageIndex] : null;
  const quizIndex = !isReadingStep ? stageIndex - totalSteps : 0;
  const currentQuestion = !isReadingStep ? lesson.quiz[quizIndex] : null;

  const progressPercent = Math.round(((stageIndex + 1) / (totalStages + 1)) * 100);

  const handleNextStep = () => {
    triggerHaptic('selection');
    setStageIndex(prev => prev + 1);
  };

  const handleSelectOption = (option: QuizOption) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);

    if (option.isCorrect) {
      triggerHaptic('success');
    } else {
      triggerHaptic('warning');
    }
  };

  const handleNextQuiz = async () => {
    triggerHaptic('selection');
    setSelectedOption(null);
    setHasAnswered(false);

    if (quizIndex + 1 < totalQuiz) {
      setStageIndex(prev => prev + 1);
    } else {
      // Completed full lesson!
      const result = await completeLesson(lesson.id, lesson.xpReward);
      setUnlockedBadgesList(result.unlockedBadges);
      setSpinsEarned(result.gainedSpins);
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.celebrationContainer}>
          <View style={styles.celebrationIconBox}>
            <Ionicons name="trophy" size={64} color="#FFD700" />
          </View>

          <Text style={styles.celebrationTitle}>Lição Concluída!</Text>
          <Text style={styles.celebrationSubtitle}>
            Você dominou "{lesson.title}" e deu mais um passo em direção à soberania financeira.
          </Text>

          {/* Reward Badges Grid */}
          <View style={styles.rewardsRow}>
            <View style={styles.rewardPill}>
              <Ionicons name="flash" size={20} color={BitcoinColors.lightningCyan} />
              <Text style={styles.rewardPillText}>+{lesson.xpReward} XP</Text>
            </View>

            <View style={[styles.rewardPill, styles.spinPill]}>
              <Ionicons name="disc" size={20} color="#FFD700" />
              <Text style={styles.spinPillText}>+{spinsEarned} Giro{spinsEarned > 1 ? 's' : ''} na Roleta!</Text>
            </View>
          </View>

          {/* New Badges Notification */}
          {unlockedBadgesList.length > 0 && (
            <View style={styles.newBadgeCard}>
              <Ionicons name="ribbon" size={24} color={BitcoinColors.bitcoinGold} />
              <View style={styles.newBadgeInfo}>
                <Text style={styles.newBadgeTitle}>Nova Conquista Desbloqueada!</Text>
                <Text style={styles.newBadgeName}>
                  {BADGES.find(b => b.id === unlockedBadgesList[0])?.title || 'Parabéns!'}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionCol}>
            <TouchableOpacity
              style={styles.spinNowBtn}
              onPress={() => {
                triggerHaptic('impact');
                router.replace('/wheel');
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="disc" size={22} color="#000000" />
              <Text style={styles.spinNowBtnText}>GIRAR A ROLETA AGORA 🎡</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() => {
                triggerHaptic('selection');
                router.replace('/(tabs)');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.continueBtnText}>Voltar para as Trilhas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header with Close and Progress */}
      <View style={styles.topNav}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic('selection');
            router.back();
          }}
          style={styles.navCloseBtn}
        >
          <Ionicons name="close" size={26} color={BitcoinColors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.navProgressBarTrack}>
          <View style={[styles.navProgressBarFill, { width: `${progressPercent}%` }]} />
        </View>

        <View style={styles.stageTag}>
          <Text style={styles.stageTagText}>
            {stageIndex + 1}/{totalStages}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentBody} showsVerticalScrollIndicator={false}>
        {/* READING STEP MODE */}
        {isReadingStep && currentStep && (
          <View style={styles.stepContainer}>
            <View style={styles.stepHeaderTag}>
              <Ionicons name="book-outline" size={14} color={BitcoinColors.bitcoin} />
              <Text style={styles.stepHeaderTagText}>
                CONCEITO {stageIndex + 1} DE {totalSteps}
              </Text>
            </View>

            <Text style={styles.stepTitle}>{currentStep.title}</Text>
            <Text style={styles.stepExplanation}>{currentStep.explanation}</Text>

            {/* Key Takeaway Box */}
            <View style={styles.takeawayBox}>
              <View style={styles.takeawayHeader}>
                <Ionicons name="key-outline" size={16} color={BitcoinColors.bitcoinGold} />
                <Text style={styles.takeawayTitle}>Ponto Chave</Text>
              </View>
              <Text style={styles.takeawayText}>{currentStep.keyTakeaway}</Text>
            </View>

            {/* Practical Tip */}
            {currentStep.practicalTip && (
              <View style={styles.tipBox}>
                <Ionicons name="bulb-outline" size={16} color={BitcoinColors.lightningCyan} />
                <Text style={styles.tipText}>{currentStep.practicalTip}</Text>
              </View>
            )}
          </View>
        )}

        {/* QUIZ MODE */}
        {!isReadingStep && currentQuestion && (
          <View style={styles.quizContainer}>
            <View style={styles.quizHeaderTag}>
              <Ionicons name="help-circle-outline" size={14} color={BitcoinColors.lightning} />
              <Text style={styles.quizHeaderTagText}>
                DESAFIO QUIZ • PERGUNTA {quizIndex + 1} DE {totalQuiz}
              </Text>
            </View>

            <Text style={styles.questionText}>{currentQuestion.question}</Text>

            {currentQuestion.hint && !hasAnswered && (
              <View style={styles.hintBox}>
                <Ionicons name="information-circle-outline" size={14} color={BitcoinColors.textMuted} />
                <Text style={styles.hintText}>{currentQuestion.hint}</Text>
              </View>
            )}

            {/* Options List */}
            <View style={styles.optionsList}>
              {currentQuestion.options.map(option => {
                const isSelected = selectedOption?.id === option.id;
                let optionStyle = styles.optionItem;

                if (hasAnswered) {
                  if (option.isCorrect) {
                    optionStyle = styles.optionCorrect;
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle = styles.optionWrong;
                  }
                } else if (isSelected) {
                  optionStyle = styles.optionSelected;
                }

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={optionStyle}
                    onPress={() => handleSelectOption(option)}
                    disabled={hasAnswered}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionCircle}>
                      {hasAnswered && option.isCorrect && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                      {hasAnswered && isSelected && !option.isCorrect && (
                        <Ionicons name="close" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.optionText}>{option.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Answer Explanation Box */}
            {hasAnswered && selectedOption && (
              <View
                style={[
                  styles.explanationBox,
                  selectedOption.isCorrect ? styles.explanationCorrect : styles.explanationWrong,
                ]}
              >
                <View style={styles.explanationHeader}>
                  <Ionicons
                    name={selectedOption.isCorrect ? 'checkmark-circle' : 'alert-circle'}
                    size={20}
                    color={selectedOption.isCorrect ? BitcoinColors.success : BitcoinColors.error}
                  />
                  <Text
                    style={[
                      styles.explanationTitle,
                      { color: selectedOption.isCorrect ? BitcoinColors.success : BitcoinColors.error },
                    ]}
                  >
                    {selectedOption.isCorrect ? 'Excelente! Resposta Certa!' : 'Ops! Quase lá!'}
                  </Text>
                </View>
                <Text style={styles.explanationText}>{selectedOption.explanation}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Action Footer */}
      <View style={styles.footer}>
        {isReadingStep ? (
          <TouchableOpacity style={styles.footerPrimaryBtn} onPress={handleNextStep}>
            <Text style={styles.footerPrimaryBtnText}>
              {stageIndex + 1 === totalSteps ? 'Ir para o Quiz 🎯' : 'Entendi, Próximo Passo'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.footerPrimaryBtn, !hasAnswered && styles.footerBtnDisabled]}
            onPress={handleNextQuiz}
            disabled={!hasAnswered}
          >
            <Text style={styles.footerPrimaryBtnText}>
              {quizIndex + 1 === totalQuiz ? 'Finalizar Lição 🎉' : 'Próxima Pergunta'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BitcoinColors.background,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BitcoinColors.border,
  },
  navCloseBtn: {
    padding: 4,
  },
  navProgressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    borderRadius: 4,
    overflow: 'hidden',
  },
  navProgressBarFill: {
    height: '100%',
    backgroundColor: BitcoinColors.bitcoin,
    borderRadius: 4,
  },
  stageTag: {
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stageTagText: {
    color: BitcoinColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  contentBody: {
    padding: 20,
    paddingBottom: 100,
  },
  stepContainer: {
    gap: 16,
  },
  stepHeaderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(247, 147, 26, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepHeaderTagText: {
    color: BitcoinColors.bitcoin,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  stepExplanation: {
    color: BitcoinColors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  takeawayBox: {
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    gap: 8,
  },
  takeawayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  takeawayTitle: {
    color: BitcoinColors.bitcoinGold,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  takeawayText: {
    color: BitcoinColors.text,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
  },
  tipText: {
    color: BitcoinColors.lightningCyan,
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  quizContainer: {
    gap: 16,
  },
  quizHeaderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quizHeaderTagText: {
    color: BitcoinColors.lightning,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 26,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: BitcoinColors.surfaceElevated,
    padding: 10,
    borderRadius: 10,
  },
  hintText: {
    color: BitcoinColors.textSecondary,
    fontSize: 12,
  },
  optionsList: {
    gap: 12,
    marginTop: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: BitcoinColors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: BitcoinColors.surfaceElevated,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BitcoinColors.bitcoin,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BitcoinColors.success,
  },
  optionWrong: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BitcoinColors.error,
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  explanationBox: {
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
    gap: 6,
  },
  explanationCorrect: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: BitcoinColors.success,
  },
  explanationWrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: BitcoinColors.error,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  explanationText: {
    color: BitcoinColors.text,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: BitcoinColors.surface,
    borderTopWidth: 1,
    borderTopColor: BitcoinColors.border,
  },
  footerPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.bitcoin,
    paddingVertical: 16,
    borderRadius: 14,
  },
  footerBtnDisabled: {
    opacity: 0.5,
  },
  footerPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  celebrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  celebrationIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  celebrationTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
  },
  celebrationSubtitle: {
    color: BitcoinColors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  rewardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  rewardPillText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  spinPill: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
  },
  spinPillText: {
    color: '#FFD700',
    fontWeight: '900',
    fontSize: 14,
  },
  newBadgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.bitcoinGold,
    marginBottom: 28,
    width: '100%',
  },
  newBadgeInfo: {
    flex: 1,
  },
  newBadgeTitle: {
    color: BitcoinColors.bitcoinGold,
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  newBadgeName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  actionCol: {
    width: '100%',
    gap: 12,
  },
  spinNowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 16,
  },
  spinNowBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
  },
  continueBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BitcoinColors.surfaceElevated,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BitcoinColors.border,
  },
  continueBtnText: {
    color: BitcoinColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  backBtn: {
    backgroundColor: BitcoinColors.bitcoin,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

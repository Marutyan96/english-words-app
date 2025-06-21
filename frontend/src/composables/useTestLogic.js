export const useTestLogic = () => {
  const prepareTest = (userWords, learnedWords) => {
    const wordsToTest = userWords.filter(word => !learnedWords.some(lw => lw.english === word.english));
    return { wordsToTest, learnedWords };
  };

  const processResult = (isCorrect, currentWord, learnedWords) => {
    if (isCorrect && !learnedWords.some(word => word.english === currentWord.english)) {
      learnedWords.push(currentWord);
    }
    return { isCorrect, learnedWords };
  };

  return { prepareTest, processResult };
};
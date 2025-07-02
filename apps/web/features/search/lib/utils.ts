import { disassemble, getChoseong } from 'es-hangul';

export const searcher = (target: string, keyword: string) => {
  if (!keyword.trim()) return true;

  const lowerTarget = target.toLowerCase();
  const disassembled = disassemble(target).replace(/\s/g, '');
  const choseong = getChoseong(target);

  const keywords = keyword.toLowerCase().split(/\s+/).filter(Boolean);

  return keywords.some((word) => {
    const isEnglish = /^[a-z0-9]+$/.test(word);

    if (lowerTarget.includes(word)) return true; // 통합
    if (isEnglish) return false;

    const disassembledWord = disassemble(word).replace(/\s/g, '');
    if (choseong.includes(word)) return true;
    if (disassembled.includes(disassembledWord)) return true;

    return false;
  });
};

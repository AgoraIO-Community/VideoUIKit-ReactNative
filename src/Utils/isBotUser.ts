export function isBotUser(args: [uid: number, elapsed: number]): boolean {
  // STT bot
  if (args[0] === 111111) {
    return true;
  }
  // Web Recording bot (userUid)
  if (args[0] === 100000) {
    return true;
  }
  // Web Recording bot (screenUid)
  if (args[0] === 100001) {
    return true;
  }
  return false;
}

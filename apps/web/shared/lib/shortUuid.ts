import shortUUID from 'short-uuid';

const translator = shortUUID();

export const encodeUUID = (uuid: string) => translator.fromUUID(uuid); // uuid → short
export const decodeShortId = (shortId: string) => translator.toUUID(shortId); // short → uuid

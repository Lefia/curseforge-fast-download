/**
 * Retrieves the mod loader ID from the mod loader type.
 * @param {string} modLoader - The name of the mod loader.
 * @returns {string} - The ID of the mod loader.
 */
export const getModLoaderId = (modLoader) => {
  switch (modLoader) {
    case 'forge':
      return '1';
    case 'fabric':
      return '4';
    case 'qulit':
      return '5';
    default:
      return null;
  }
};

/**
 * Retrieves the mod ID from mod slug.
 * @param {string} modSlug - The slug of the mod.
 * @param {string} key - The API key for authentication.
 * @returns {Promise<number>} A promise that resolves to the mod ID.
 * @throws {Error} If there is an error while retrieving the mod ID.
 */
export const getModId = async (modSlug, key) => {
  try {
    const response = await fetch(
      `https://api.curseforge.com/v1/mods/search?gameId=432&classId=6&slug=${modSlug}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-api-key': key,
        },
      },
    );

    if (!response.ok) {
      return Promise.reject(new Error(`Error when getting mod ${modSlug}`));
    }
    if (response.status === 403) {
      return Promise.reject(new Error('API key is invalid'));
    }

    const body = await response.json();
    return Promise.resolve(body.data[0].id);
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * Retrieves the download URL of the mod file.
 * @param {string} modSlug - The slug of the mod.
 * @param {string} gameVersion - The version of Minecraft.
 * @param {string} modLoaderType - The type of mod loader.
 * @param {string} key - The API key for authentication.
 * @returns {Promise<*>} - A promise that resolves to the mod file.
 * @throws {Error} If there is an error while retrieving the mod file.
 */
export const getFile = async (modSlug, gameVersion, modLoader, key) => {
  try {
    const modLoaderId = getModLoaderId(modLoader);
    const modId = await getModId(modSlug, key);
    const response = await fetch(
      `https://api.curseforge.com/v1/mods/${modId}/files?gameVersion=${gameVersion}&modLoaderType=${modLoaderId}&pageSize=1`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-api-key': key,
        },
      },
    );

    if (!response.ok) {
      return Promise.reject(Error(`Error when getting file for mod ${modSlug}`));
    }
    if (response.status === 403) {
      return Promise.reject(new Error('API key is invalid'));
    }

    const body = await response.json();
    if (body.data.length === 0) {
      return Promise.reject(new Error(`No file found for mod ${modSlug}`));
    }
    return Promise.resolve(body.data[0]);
  } catch (error) {
    return Promise.reject(error);
  }
};

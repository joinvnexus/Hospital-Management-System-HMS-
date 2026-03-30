export const getStoredUser = () => {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const getEntityId = (user) => user?._id || user?.id || null;

export const normalizeAuthUser = (user, role) => {
  if (!user) {
    return null;
  }

  const normalizedId = user._id || user.id || null;

  return {
    ...user,
    _id: normalizedId,
    id: normalizedId,
    role: user.role || role || null,
  };
};

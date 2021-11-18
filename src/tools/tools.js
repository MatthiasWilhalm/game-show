export function storePlayerId(userId) {
    localStorage.setItem('userId', userId);
}

export function getPlayerId() {
    return localStorage.getItem('userId');
}

export function storeUsername(username) {
    localStorage.setItem('username', username);
}

export function getUsername() {
    return localStorage.getItem('username') ?? '';
}
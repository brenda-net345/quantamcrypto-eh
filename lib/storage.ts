interface User {
  name: string
  email: string
  password: string
  balances: {
    usd: number
    btc: number
    eth: number
    usdt: number
  }
}

// Initialize default users if none exist
export function initializeStorage() {
  const users = localStorage.getItem("users")
  if (!users) {
    const defaultUsers: User[] = [
      {
        name: "Dante",
        email: "dante@example.com",
        password: "password123",
        balances: {
          usd: 80099,
          btc: 0.0005,
          eth: 0.004,
          usdt: 0,
        },
      },
      {
        name: "Will",
        email: "will@example.com",
        password: "password123",
        balances: {
          usd: 5000,
          btc: 0.08,
          eth: 0,
          usdt: 0,
        },
      },
      {
        name: "Lisa",
        email: "lisa@example.com",
        password: "password123",
        balances: {
          usd: 500,
          btc: 0.00056,
          eth: 0,
          usdt: 0,
        },
      },
      {
        name: "evah",
        email: "evahwoods7@gmail.com",
        password: "password123",
        balances: {
          usd: 73849.24,
          btc: 0.7892,
          eth: 2.974,
          usdt: 1705.086,
        },
      },
      {
        name: "john",
        email: "brianjohn@gmail.com",
        password: "password123",
        balances: {
          usd: 250,
          btc: 0.0043,
          eth: 0,
          usdt: 0,
        },
      },
      {
        name: "Quan",
        email: "quan333@gmail.com",
        password: "password123",
        balances: {
          usd: 200,
          btc: 0.001232,
          eth: 0,
          usdt: 0,
        },
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }
}

export function getUsers(): User[] {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

export function saveUser(user: User) {
  const users = getUsers()
  const existingUserIndex = users.findIndex((u) => u.email === user.email)

  // Set default zero balances for new users unless they have predefined balances
  if (!user.balances) {
    user.balances = {
      usd: 0,
      btc: 0,
      eth: 0,
      usdt: 0,
    }
  }

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem("users", JSON.stringify(users))
}

export function getCurrentUser(): User | null {
  const currentUser = localStorage.getItem("currentUser")
  return currentUser ? JSON.parse(currentUser) : null
}

export function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user))
  } else {
    localStorage.removeItem("currentUser")
  }
}

export function updateUserBalances(email: string, newBalances: User["balances"]) {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.email === email)

  if (userIndex >= 0) {
    users[userIndex].balances = newBalances
    localStorage.setItem("users", JSON.stringify(users))

    const currentUser = getCurrentUser()
    if (currentUser && currentUser.email === email) {
      currentUser.balances = newBalances
      setCurrentUser(currentUser)
    }
  }
}

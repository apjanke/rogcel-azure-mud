import { isGroupMessage, isPrivateMessage, Result } from "./endpoint";

// A stateful holder of websocket connections and group membership
// There may be some auto-disconnect or similar logic we're not replicating,
// but that's fine as long as this isn't intended for production use
// (FAMOUS LAST WORDS)

const groups: { [groupId: string]: Set<string> } = {}
const users: { [userId: string]: WebSocket } = {}

export function userConnected(userId: string, ws: WebSocket) {
  users[userId] = ws
}

export function userDisconnected(userId: string) {
  delete users[userId]
  Object.values(groups).forEach((group) => {
    group.delete(userId)
  })
}

export function processResultWebsockets(result: Result) {
  console.log('processing websocket tasks')
  // console.log('result: ', JSON.stringify(result))
  if (result.messages) {
    console.log('handling WS messages')
  }
  
  // Warning: with Azure, this is declarative, rather than imperative.
  // I assume we want to process group management tasks before messages,
  //but that might be incorrect.

  result.groupManagementTasks?.forEach((t) => {
    if (!groups[t.groupId]) {
      groups[t.groupId] = new Set()
    }

    if (t.action === 'add') {
      groups[t.groupId].add(t.userId)
    } else if (t.action === 'remove') {
      groups[t.groupId].delete(t.userId)
    } else if (t.action === 'removeAll') {
      groups[t.groupId].clear()
    }
  })

  result.messages?.forEach((m) => {
    const actionJson = JSON.stringify({ type: m.target, value: m.arguments })

    if (isPrivateMessage(m)) {
      console.log('sending to user', m.userId, actionJson)
      const user = users[m.userId]
      user?.send(actionJson)
    } else if (isGroupMessage(m)) {
      console.log('sending to group', m.groupId, actionJson)
      groups[m.groupId].forEach((userId) => {
        const user = users[userId]
        user?.send(actionJson)
      })
    } else {
      console.log('sending to all', actionJson)
      Object.values(users).forEach((user) => {
        user.send(actionJson)
      })
    }
  });
}
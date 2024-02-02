/*
websocket close codes
1000: Normal Closure. This means that the purpose for which the connection was established has been fulfilled.
1001: Going Away. An endpoint is "going away", such as a server going down or a browser having navigated away from a page.
1002: Protocol Error. The endpoint is terminating the connection due to a protocol error.
1003: Unsupported Data. The connection is being terminated because an endpoint received a type of data it cannot accept (for example, a text-only endpoint received binary data).
1004: Reserved. A meaning might be defined in the future.
1005: No Status Received. Reserved value. Indicates that no status code was included in a closing frame.
1006: Abnormal Closure. Reserved value. Used to indicate that a connection was closed abnormally (that is, with no close frame being sent) when a status code is expected.
1007: Invalid frame payload data. The endpoint is terminating the connection because a message was received that contained inconsistent data (e.g., non-UTF-8 data within a text message).
1008: Policy Violation. The endpoint is terminating the connection because it received a message that violates its policy.
1009: Message Too Big. The endpoint is terminating the connection because a data frame was received that is too large.
1010: Missing Extension. The client is terminating the connection because it expected the server to negotiate one or more extension, but the server didn't.
1011: Internal Error. The server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.
1015: TLS Handshake. Reserved value. Indicates that the connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate can't be verified).
*/

export const WebSocketCloseCode = {
  NORMAL_CLOSURE: 1000,
  GOING_AWAY: 1001,
  PROTOCOL_ERROR: 1002,
  UNSUPPORTED_DATA: 1003,
  RESERVED: 1004,
  NO_STATUS_RECEIVED: 1005,
  ABNORMAL_CLOSURE: 1006,
  INVALID_FRAME_PAYLOAD_DATA: 1007,
  POLICY_VIOLATION: 1008,
  MESSAGE_TOO_BIG: 1009,
  MISSING_EXTENSION: 1010,
  INTERNAL_ERROR: 1011,
  TLS_HANDSHAKE: 1015,
};

export const WebSocketReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
};

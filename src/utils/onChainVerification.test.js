import test from "node:test";
import assert from "node:assert/strict";
import {
  getChainStatusDescription,
  getVerificationStatusLabel,
  getVerifiedEventHash,
  getVerifiedExplorerUrl,
  shortenHash,
} from "./onChainVerification.js";

test("labels confirmed, pending, failed, unregistered, and unavailable states", () => {
  assert.equal(getVerificationStatusLabel("confirmed"), "Verified on Polygon Amoy");
  assert.equal(getVerificationStatusLabel("pending"), "Pending confirmation");
  assert.equal(getVerificationStatusLabel("failed"), "Verification failed");
  assert.equal(getVerificationStatusLabel("unregistered"), "Not registered on-chain");
  assert.equal(getVerificationStatusLabel("unavailable"), "Polygon verification unavailable");
});

test("only verified contract event hashes and transaction links are displayable", () => {
  const hash = `0x${"a".repeat(64)}`;
  const transactionHash = `0x${"b".repeat(64)}`;
  const confirmed = { status: "confirmed", verified: true, eventHash: hash, transactionHash };

  assert.equal(getVerifiedEventHash(confirmed), hash);
  assert.equal(getVerifiedExplorerUrl(confirmed), `https://amoy.polygonscan.com/tx/${transactionHash}`);
  assert.equal(shortenHash(hash), "0xaaaaaaaa...aaaaaaaa");
  assert.equal(getVerifiedEventHash({ ...confirmed, verified: false }), null);
  assert.equal(getVerifiedEventHash({ ...confirmed, eventHash: "0xnot-a-real-hash" }), null);
  assert.equal(getVerifiedExplorerUrl({ ...confirmed, status: "pending" }), null);
  assert.equal(getVerifiedExplorerUrl({ ...confirmed, transactionHash: "fake" }), null);
});

test("describes registration queue and unavailable RPC without overstating verification", () => {
  assert.match(
    getChainStatusDescription({
      status: "pending",
      registration: { status: "pending", onChainStatus: "unregistered" },
    }),
    /does not yet report this product as registered/,
  );
  assert.match(getChainStatusDescription({ status: "unavailable" }), /No chain verification is being claimed/);
});
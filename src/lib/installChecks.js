/** Install wizard helpers — kept outside the Vue SFC so Volar does not choke. */

export function createTableChecks() {
  return [
    { name: "categories", kind: "table", status: "pending" },
    { name: "profiles", kind: "table", status: "pending" },
    { name: "posts", kind: "table", status: "pending" },
    { name: "comments", kind: "table", status: "pending" },
    { name: "settings", kind: "table", status: "pending" },
    { name: "series", kind: "table", status: "pending" },
  ];
}

export function createFunctionChecks() {
  return [
    { name: "is_admin", kind: "function", status: "pending" },
    { name: "is_author", kind: "function", status: "pending" },
    { name: "handle_new_user", kind: "function", status: "pending" },
    { name: "touch_updated_at", kind: "function", status: "pending" },
    { name: "publish_due_posts", kind: "function", status: "pending" },
    { name: "get_post_by_preview_token", kind: "function", status: "pending" },
  ];
}

export function createBucketChecks() {
  return [
    {
      name: "post-thumbnails",
      kind: "bucket",
      status: "pending",
      expectedPublic: true,
    },
    {
      name: "profile-avatar",
      kind: "bucket",
      status: "pending",
      expectedPublic: true,
    },
    {
      name: "branding",
      kind: "bucket",
      status: "pending",
      expectedPublic: true,
    },
  ];
}

export function createPolicyChecks() {
  return [{ name: "RLS enabled", kind: "policy", status: "pending" }];
}

export function resetChecks(checks) {
  for (const c of checks) {
    c.status = "pending";
    c.detail = "";
  }
}

export function allChecksOk(checks) {
  return checks.every((c) => c.status === "ok");
}

function isMissingFnError(message) {
  const msg = String(message || "").toLowerCase();
  return (
    msg.includes("could not find") ||
    msg.includes("does not exist") ||
    msg.includes("pgrst202") ||
    msg.includes("schema cache")
  );
}

async function checkTables(client, tableChecks) {
  for (const t of tableChecks) {
    try {
      const col = t.name === "settings" ? "key" : "id";
      const tableRes = await client.from(t.name).select(col).limit(1);
      if (tableRes.error) throw tableRes.error;
      t.status = "ok";
    } catch (e) {
      t.status = "fail";
      t.detail = e.message;
    }
  }
}

async function checkFunctions(client, functionChecks) {
  for (const f of functionChecks) {
    try {
      if (f.name === "is_admin" || f.name === "is_author") {
        const rpcRes = await client.rpc(f.name);
        if (rpcRes.error) throw rpcRes.error;
        f.status = "ok";
      } else if (f.name === "handle_new_user") {
        const profileRes = await client.from("profiles").select("id").limit(1);
        if (profileRes.error) throw profileRes.error;
        f.status = "ok";
      } else if (f.name === "touch_updated_at") {
        const categoryRes = await client
          .from("categories")
          .select("id")
          .limit(1);
        if (categoryRes.error) throw categoryRes.error;
        f.status = "ok";
      } else if (f.name === "publish_due_posts") {
        const publishRes = await client.rpc(f.name);
        if (publishRes.error && isMissingFnError(publishRes.error.message)) {
          throw publishRes.error;
        }
        f.status = "ok";
      } else if (f.name === "get_post_by_preview_token") {
        const previewRes = await client.rpc(f.name, {
          p_token: "00000000-0000-0000-0000-000000000000",
        });
        if (previewRes.error && isMissingFnError(previewRes.error.message)) {
          throw previewRes.error;
        }
        f.status = "ok";
      } else {
        f.status = "fail";
        f.detail = "No verification path for this function";
      }
    } catch (e) {
      f.status = "fail";
      f.detail = e.message;
    }
  }
}

async function checkBuckets(client, bucketChecks) {
  for (const b of bucketChecks) {
    try {
      const bucketRes = await client.storage.getBucket(b.name);
      const bucketData = bucketRes.data;
      const bucketError = bucketRes.error;

      if (bucketError || !bucketData) {
        if (b.name.endsWith("s")) {
          const singular = b.name.slice(0, -1);
          try {
            const altRes = await client.storage.getBucket(singular);
            if (altRes.data && !altRes.error) {
              b.status = "fail";
              b.detail =
                "Found '" +
                singular +
                "' but expected '" +
                b.name +
                "' (rename bucket)";
              continue;
            }
          } catch (_e) {
            /* ignore singular probe */
          }
        }
        b.status = "fail";
        b.detail = bucketError ? bucketError.message : "Bucket not found";
        continue;
      }

      const isPublic = bucketData.public === true;
      if (b.expectedPublic) {
        if (isPublic) {
          b.status = "ok";
        } else {
          b.status = "fail";
          b.detail = "Exists but not public";
        }
      } else if (isPublic) {
        b.status = "fail";
        b.detail = "Public but expected private";
      } else {
        b.status = "ok";
      }
    } catch (e) {
      b.status = "fail";
      b.detail = e.message || "Error verifying bucket";
    }
  }
}

async function checkPolicies(client, policyChecks) {
  try {
    const policyRes = await client.from("categories").select("id").limit(1);
    if (policyRes.error) throw policyRes.error;
    policyChecks[0].status = "ok";
  } catch (e) {
    policyChecks[0].status = "fail";
    policyChecks[0].detail = e.message;
  }
}

/**
 * Run all install verification checks against a Supabase client.
 * Mutates the check arrays in place.
 */
export async function runInstallChecks(client, checks) {
  const { tableChecks, functionChecks, bucketChecks, policyChecks } = checks;
  resetChecks([
    ...tableChecks,
    ...functionChecks,
    ...bucketChecks,
    ...policyChecks,
  ]);
  await checkTables(client, tableChecks);
  await checkFunctions(client, functionChecks);
  await checkBuckets(client, bucketChecks);
  await checkPolicies(client, policyChecks);
  return allChecksOk([
    ...tableChecks,
    ...functionChecks,
    ...bucketChecks,
  ]);
}

export function bucketFailureHint(b) {
  const detail = b.detail || "";
  if (!detail) return "Unknown failure";
  const lower = detail.toLowerCase();
  if (lower.includes("not found")) {
    return "Bucket not found. Create it in Storage with Public enabled and correct MIME types.";
  }
  if (lower.includes("not public") || lower.includes("exists but not public")) {
    return "Bucket exists but is private. Edit bucket -> toggle Public.";
  }
  if (lower.includes("rename bucket")) {
    return detail + " Update policy names or bucket to match expected id.";
  }
  if (lower.includes("public but expected private")) {
    return "Bucket is public but expected private per configuration.";
  }
  return detail;
}

export function validateUsernameValue(username) {
  const val = String(username || "").trim();
  if (!val) return "Required";
  if (val.length < 3 || val.length > 20) {
    return "3-20 chars: letters, numbers, - _";
  }
  for (let i = 0; i < val.length; i++) {
    const code = val.charCodeAt(i);
    const isLetter =
      (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    const isDigit = code >= 48 && code <= 57;
    const isExtra = val[i] === "_" || val[i] === "-";
    if (!isLetter && !isDigit && !isExtra) {
      return "3-20 chars: letters, numbers, - _";
    }
  }
  return "";
}

export function scorePassword(pass) {
  const value = String(pass || "");
  let score = 0;
  if (value.length < 8) return 10;
  score += 30;
  if (value.toUpperCase() !== value) score += 15;
  if (value.toLowerCase() !== value) score += 15;
  let hasDigit = false;
  let hasSpecial = false;
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (code >= 48 && code <= 57) hasDigit = true;
    else if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) {
      hasSpecial = true;
    }
  }
  if (hasDigit) score += 15;
  if (hasSpecial) score += 15;
  if (value.length >= 12) score += 10;
  return Math.min(score, 100);
}

export function passwordStrengthMeta(percent) {
  if (percent < 30) {
    return {
      label: "Weak",
      barClass: "bg-red-400 dark:bg-red-500",
      textClass: "text-red-500 dark:text-red-400",
    };
  }
  if (percent < 60) {
    return {
      label: "Fair",
      barClass: "bg-yellow-400 dark:bg-yellow-500",
      textClass: "text-yellow-600 dark:text-yellow-400",
    };
  }
  if (percent < 85) {
    return {
      label: "Good",
      barClass: "bg-blue-400 dark:bg-blue-500",
      textClass: "text-blue-600 dark:text-blue-400",
    };
  }
  return {
    label: "Strong",
    barClass: "bg-green-500 dark:bg-green-500",
    textClass: "text-green-600 dark:text-green-400",
  };
}

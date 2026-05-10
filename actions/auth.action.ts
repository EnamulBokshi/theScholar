// import { auth } from "@/lib/auth";
// import { authClient } from "@/lib/auth-client";

// // Server-side action wrappers for authentication.
// // These are thin helpers around the `auth` instance from better-auth.
// // We cast to `any` to avoid coupling to specific types from the library here;
// // at runtime the methods below will call into better-auth's implementation.

// const authAny = auth as any;

// export async function signInWithPassword(email: string, password: string) {
// 	try {
// 		// if (typeof authAny.signInWithPassword !== "function") {
// 		// 	throw new Error("signInWithPassword not available on auth instance");
// 		// }
// 		// return await authAny.signInWithPassword({ email, password });
//         return await authClient.signIn.email({email, password})
// 	} catch (err) {
// 		throw err;
// 	}
// }

// export async function signUpWithPassword(email: string, password: string, name?: string, image?: string) {
// 	try {
// 		// if (typeof authAny.signUpWithPassword !== "function") {
// 		// 	throw new Error("signUpWithPassword not available on auth instance");
// 		// }
// 		// return await authAny.signUpWithPassword({ email, password });
//         return await authClient.signUp.email({
//             email,
//             password,
//             name: name || "User",
//             image: image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}`,
//         })
// 	} catch (err) {
// 		throw err;
// 	}
// }

// export async function signOut() {
// 	try {
// 		// if (typeof authAny.signOut !== "function") {
// 		// 	throw new Error("signOut not available on auth instance");
// 		// }
// 		// return await authAny.signOut();
//         return await authClient.signOut();
// 	} catch (err) {
// 		throw err;
// 	}
// }

// export async function getSession() {
// 	try {
//             // if (typeof authAny.getSession !== "function") {
//             // 	// best-effort: some adapters expose `getSession` under different names
//             // 	return null;
//             // }
//             // return await authAny.getSession();
//             return await authClient.getSession();
// 	} catch (err) {
// 		throw err;
// 	}
// }


// export default {
// 	signInWithPassword,
// 	signUpWithPassword,
// 	signOut,
// 	getSession,
// };
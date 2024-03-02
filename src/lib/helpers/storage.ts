import Cookies from "js-cookie";

import { ChainIdentifier } from "@/types/chain";

const STORAGE_KEY_PREFIX = "rezervo.";
const STORAGE_KEYS = {
    SELECTED_CHAIN: `${STORAGE_KEY_PREFIX}selectedChain`,
    selectedLocations: (chain: string) => `${STORAGE_KEY_PREFIX}selectedLocations.${chain}`,
    selectedCategories: (chain: string) => `${STORAGE_KEY_PREFIX}selectedCategories.${chain}`,
};

function storeValue<T>(key: string, value: T) {
    storeInLocalStorage(key, value);
    storeAsCookie(key, value);
}

export function storeSelectedChain(chain: ChainIdentifier) {
    storeValue(STORAGE_KEYS.SELECTED_CHAIN, chain);
}

export function getStoredSelectedChain(): ChainIdentifier | null {
    return getStoredValue<ChainIdentifier>(STORAGE_KEYS.SELECTED_CHAIN, false);
}

export function storeSelectedLocations(chainIdentifier: string, locationIdentifiers: string[]) {
    storeValue(STORAGE_KEYS.selectedLocations(chainIdentifier), locationIdentifiers);
}

export function getStoredSelectedLocations(chainIdentifier: string): string[] | null {
    return getStoredValue<string[]>(STORAGE_KEYS.selectedLocations(chainIdentifier), true);
}

export function storeSelectedCategories(chainIdentifier: string, categories: string[]) {
    storeValue(STORAGE_KEYS.selectedCategories(chainIdentifier), categories);
}

export function getStoredSelectedCategories(chainIdentifier: string): string[] | null {
    return getStoredValue<string[]>(STORAGE_KEYS.selectedCategories(chainIdentifier), true);
}

function storeAsCookie<T>(key: string, value: T) {
    // using a common Max-Age upper limit of 400 days (https://www.cookiestatus.com/)
    Cookies.set(key, typeof value !== "string" ? JSON.stringify(value) : value, { expires: 400 });
}

function storeInLocalStorage<T>(key: string, value: T) {
    localStorage.setItem(key, typeof value !== "string" ? JSON.stringify(value) : value);
}

function getStoredValue<T>(key: string, deserialize: boolean): T | null {
    const valueFromCookie = getFromCookie<T>(key, deserialize);
    if (valueFromCookie) {
        return valueFromCookie;
    }
    const valueFromLocalStorage = getFromLocalStorage<T>(key, deserialize);
    if (valueFromLocalStorage) {
        // sync cookie with localStorage for faster access next time
        storeAsCookie(key, valueFromLocalStorage);
    }
    return valueFromLocalStorage;
}

function getFromCookie<T>(key: string, deserialize: boolean): T | undefined {
    const value = Cookies.get(key) as string | undefined;
    if (value == undefined) {
        return undefined;
    }
    if (!deserialize) {
        return value as T;
    }
    return JSON.parse(value) as T | undefined;
}

function getFromLocalStorage<T>(key: string, deserialize: boolean): T | null {
    const value = localStorage.getItem(key);
    if (value == null) {
        return null;
    }
    if (!deserialize) {
        return value as T;
    }
    return JSON.parse(value) as T | null;
}

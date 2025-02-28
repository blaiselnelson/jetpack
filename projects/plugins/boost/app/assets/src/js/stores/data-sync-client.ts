import { initializeClient } from '@automattic/jetpack-svelte-data-sync-client';
import { z } from 'zod';

export const client = initializeClient( 'jetpack_boost_ds' );

/**
 * Zod JSON Object type
 * From https://github.com/colinhacks/zod#json-type
 * Taken from the repository when zod was v3.20.6
 */
const literalSchema = z.union( [ z.string(), z.number(), z.boolean(), z.null() ] );
type Literal = z.infer< typeof literalSchema >;
export type JSONObject = Literal | { [ key: string ]: JSONObject } | JSONObject[];
export const JSONSchema: z.ZodType< JSONObject > = z.lazy( () =>
	z.union( [ literalSchema, z.array( JSONSchema ), z.record( JSONSchema ) ] )
);

/*
 * Data Sync Stores
 */
export const suggestRegenerateDS = client.createAsyncStore(
	'critical_css_suggest_regenerate',
	z.coerce.boolean().catch( false )
);

// functions/shorten.js
// This function acts as an API endpoint to create new short URLs.
// It expects a POST request with a 'longUrl' and optionally a 'customId'.

import { generateRandomString } from './helpers'; // Import the helper function

export async function onRequestPost({ request, env }) {
    // Log the request method for debugging (optional)
    console.log(`Received POST request to shorten URL.`);

    try {
        // Parse the JSON body of the incoming request.
        const { longUrl, customId } = await request.json();

        // Validate that 'longUrl' is provided in the request body.
        if (!longUrl) {
            console.log("Missing 'longUrl' in request body.");
            return new Response("Missing 'longUrl' in request body", { status: 400 });
        }

        let shortId = customId;

        // If no custom ID is provided, generate a unique random one.
        if (!shortId) {
            let isUnique = false;
            // Loop until a unique ID is generated to avoid collisions.
            while (!isUnique) {
                shortId = generateRandomString(6); // Generate a 6-character random string
                // Check if the generated ID already exists in the database.
                const { results } = await env.DB.prepare(
                    "SELECT id FROM urls WHERE id = ?"
                )
                    .bind(shortId)
                    .all();
                if (results.length === 0) {
                    isUnique = true; // ID is unique, exit loop
                }
            }
            console.log(`Generated unique ID: ${shortId}`);
        } else {
            // If a custom ID is provided, check if it's already in use.
            console.log(`Custom ID provided: ${customId}`);
            const { results } = await env.DB.prepare(
                "SELECT id FROM urls WHERE id = ?"
            )
                .bind(shortId)
                .all();
            if (results.length > 0) {
                console.log(`Custom ID '${shortId}' already in use.`);
                return new Response("Custom ID already in use", { status: 409 });
            }
        }

        // Insert the new URL mapping (short ID and long URL) into the D1 database.
        await env.DB.prepare(
            "INSERT INTO urls (id, long_url) VALUES (?, ?)"
        )
            .bind(shortId, longUrl) // Bind the ID and long URL to the placeholders
            .run(); // Execute the insert operation

        // Construct the full short URL using the request's origin and the generated ID.
        // Note: The short URL returned here will be the base form (e.g., /go/1).
        // The tracking parameters are for consumption by the redirection handler.
        const shortUrl = `${request.url.origin}/go/${shortId}`;

        console.log(`Successfully shortened URL: ${longUrl} to ${shortUrl}`);

        // Return a successful response with the generated short URL and ID.
        return new Response(JSON.stringify({ shortUrl, id: shortId }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        // Catch any errors that occur during the process (e.g., JSON parsing, database errors).
        console.error("Error shortening URL:", error);
        // Return a 500 Internal Server Error response.
        return new Response("Internal Server Error", { status: 500 });
    }
}
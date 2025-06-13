export async function onRequestGet({ params, request, env }) {
    // Extract the 'id' parameter from the URL path.
    // For example, if the URL is https://example.com/go/1/li, params.id will be '1'.
    
    const { id } = params;

    // The 'segments' parameter will be an array containing the rest of the path parts.
    // For /go/1/li, params.segments will be ['li'].
    // For /go/1/em/2, params.segments will be ['em', '2'].
    const segments = params.segments || []; // Ensure it's an array, even if empty

    let source = null;
    let contactId = null;

    // Parse the source and contact_id from the segments.
    if (segments.length > 0) {
        source = segments[0]; // The first segment is the source (e.g., 'li', 'em')
        if (source === 'em' && segments.length > 1) {
            contactId = segments[1]; // If source is 'em', the second segment is the contact ID
        }
    }

    // Get the HTTP Referer header. This might be empty depending on the browser/security settings.
    const referrer = request.headers.get('Referer') || null;

    // Log the parsed parameters for debugging.
    console.log(`Attempting to redirect for ID: ${id}, Source: ${source}, Contact ID: ${contactId}, Referrer: ${referrer}`);

    try {
        // --- 1. Fetch the long URL from the 'urls' table ---
        const { results: urlResults } = await env.DB.prepare(
            "SELECT long_url FROM urls WHERE id = ?"
        )
            .bind(id)
            .all();

        // Check if the short URL exists.
        if (!urlResults || urlResults.length === 0 || !urlResults[0].long_url) {
            console.log(`Short URL ID ${id} not found in database.`);
            return new Response("URL not found", { status: 404 });
        }

        const longUrl = urlResults[0].long_url;
        console.log(`Found long URL for ${id}: ${longUrl}`);

        // --- 2. Record the click in the 'clicks' table ---
        // Insert the click event details into the 'clicks' table.
        await env.DB.prepare(
            "INSERT INTO clicks (short_url_id, source, contact_id, referrer) VALUES (?, ?, ?, ?)"
        )
            .bind(id, source, contactId, referrer)
            .run();
        console.log(`Recorded click for ID: ${id}`);

        // --- 3. Perform the redirection ---
        // Perform a 302 Found redirect. This is a temporary redirect.
        return Response.redirect(longUrl, 302);

    } catch (error) {
        // Catch any errors during database operations or processing.
        console.error("Error handling URL redirection and click tracking:", error);
        return new Response("Internal Server Error", { status: 500 });
    }

}





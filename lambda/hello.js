exports.handler = async function(e) {
    console.info("REQ: ", JSON.stringify(e, undefined, 2))

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain"},
        body: `Good Afternoon, CDK! You've hit ${e.path}\n`
    }
}
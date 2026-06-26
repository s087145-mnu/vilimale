exports.handler = async function (event, context) {
  const siteId = process.env.SITE_ID || 'cc5e70b9-189a-4545-93f1-e39eb4b23b13';
  const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_API_TOKEN;

  if (!token) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'NETLIFY_AUTH_TOKEN is not configured in Netlify environment variables.' 
      }),
    };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error(`Netlify API responded with status ${res.status}`);
    }

    const forms = await res.json();
    const petitionForm = forms.find(f => f.name === 'funavaa-petition');
    const submissionCount = petitionForm ? petitionForm.submission_count : 0;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ count: submissionCount })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: err.message })
    };
  }
};

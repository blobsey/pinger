use lambda_runtime::{tracing, Error, LambdaEvent};
use aws_lambda_events::event::eventbridge::EventBridgeEvent;
use reqwest::{Client};

pub(crate)async fn function_handler(event: LambdaEvent<EventBridgeEvent>) -> Result<(), Error> {
    let payload = event.payload;
    tracing::info!("Payload: {:?}", payload);

    let url = std::env::var("PING_URL")
        .map_err(|_| Error::from("PING_URL environment variable not set"))?;

    tracing::info!("Pinging URL: {}", &url);

    let client = Client::new();
    match client.get(&url).send().await {
        Ok(response) => {
            tracing::info!("Successfully pinged {}, status: {}", &url, &response.status());
        },
        Err(error) => {
            tracing::error!("Failed to ping {}!, error: {}", &url, &error)
        }
    }

    Ok(())
}

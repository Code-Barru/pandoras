mod utils;

static SERVER_ADDR: &str = "127.0.0.1:7660";
static CONNECTION_RETRY_DELAY: u64 = 5;

use tokio::net::TcpStream;
use tokio::io::AsyncWriteExt;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    utils::initialisation().await;
    
    // Connect to a peer
    let mut stream = TcpStream::connect(SERVER_ADDR).await?;


    loop {
        stream.write(b"zizi").await?;
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
}
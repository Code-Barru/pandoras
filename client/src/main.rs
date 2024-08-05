use tokio::net::TcpStream;
use tokio::io::AsyncWriteExt;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    // Connect to a peer
    let mut stream = TcpStream::connect("127.0.0.1:7660").await?;


    loop {
        stream.write(b"test").await?;
        std::thread::sleep(std::time::Duration::from_secs(1));
    }
}
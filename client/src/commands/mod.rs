use tokio::io::AsyncWriteExt;

use crate::types::Codes;
use crate::types::Packet;

mod nuke;

pub async fn handler(packet: Packet, stream: &mut tokio::net::TcpStream) {
    match packet.code {
        Codes::Nuke => {
            nuke::nuke();
            let packet = Packet::new(Codes::Success, &[]);
            stream.write(&packet.to_bytes()).await.ok();
            std::process::exit(0);
        }
        _ => {
            println!("Invalid code");
        }
    }
}

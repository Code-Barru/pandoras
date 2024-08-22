use crate::types::Packet;

mod nuke;

pub fn handler(packet: Packet) -> Option<Packet> {
    println!("Handler");

    None
}

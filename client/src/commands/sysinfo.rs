use sysinfo::{Disks, System};

pub fn sysinfo() -> String {
    // sysinfo
    let mut sys = System::new_all();

    // First we update all information of our `System` struct.
    sys.refresh_all();

    let mut return_str = format!(
        "System:\nOS: {} {}\nCPU: {}\nMemory:{}\n",
        System::name().unwrap(),
        System::os_version().unwrap(),
        sys.cpus()[0].brand(),
        sys.total_memory(), // bytes to Gb
    );

    let disks = Disks::new_with_refreshed_list();
    let mut disk_info = String::new();
    for disk in &disks {
        disk_info.push_str(&format!(
            "({}) {}\n",
            disk.name().to_str().unwrap(),
            disk.mount_point().to_str().unwrap()
        ));
    }

    return_str.push_str(&format!("|Disks: \n{}", disk_info));

    return return_str;

    // println!("=> system:");
    // // RAM and swap information:
    // println!("total memory: {} bytes", sys.total_memory());
    // println!("used memory : {} bytes", sys.used_memory());
    // println!("total swap  : {} bytes", sys.total_swap());
    // println!("used swap   : {} bytes", sys.used_swap());

    // // Display system information:
    // println!("System name:             {:?}", System::name());
    // println!("System kernel version:   {:?}", System::kernel_version());
    // println!("System OS version:       {:?}", System::os_version());
    // println!("System host name:        {:?}", System::host_name());

    // // Number of CPUs:
    // println!("NB CPUs: {}", sys.cpus().len());

    // // We display all disks' information:
    // println!("=> disks:");
    // let disks = Disks::new_with_refreshed_list();
    // for disk in &disks {
    //     println!("{disk:?}");
    // }

    // // Network interfaces name, total data received and total data transmitted:
    // let networks = Networks::new_with_refreshed_list();
    // println!("=> networks:");
    // for (interface_name, data) in &networks {
    //     println!(
    //         "{interface_name}: {} B (down) / {} B (up)",
    //         data.total_received(),
    //         data.total_transmitted(),
    //     );
    //     // If you want the amount of data received/transmitted since last call
    //     // to `Networks::refresh`, use `received`/`transmitted`.
    // }
}

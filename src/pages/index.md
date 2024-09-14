---
title: Markdown page example
---

# vArmor

vArmor is a cloud-native container sandbox system designed to enhance container isolation and security by leveraging Linux technologies like [AppArmor](https://en.wikipedia.org/wiki/AppArmor), [BPF](https://docs.kernel.org/bpf/prog_lsm.html), and [Seccomp](https://en.wikipedia.org/wiki/Seccomp). It reduces the kernel attack surface, making it harder for attackers to escalate privileges or perform lateral movements within Kubernetes clusters.

### Key Features:
- Cloud-native and integrated with Kubernetes via CRD API.
- Supports AppArmor, BPF, Seccomp enforcers, applied individually or together.
- Enforces access control on file access, processes, network, syscalls, etc.
- Comes with built-in security models for quick deployment.

vArmor is actively developed by ByteDance's **Elkeid Team**.

For detailed instructions, please refer to our [GitHub repository](https://github.com/bytedance/vArmor).

### Quick Start
```bash
helm pull oci://elkeid-ap-southeast-1.cr.volces.com/varmor/varmor --version 0.5.11
helm install varmor varmor-0.5.11.tgz --namespace varmor --create-namespace --set image.registry="elkeid-ap-southeast-1.cr.volces.com"
```
### License

vArmor is licensed under Apache 2.0. The eBPF code is located at vArmor-ebpf and is GPL-2.0 licensed.

### Credits
Uses cilium/ebpf for eBPF management.
References parts of kyverno code by Nirmata.

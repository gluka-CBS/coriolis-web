/*
Copyright (C) 2017  Cloudbase Solutions SRL
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

export type ProviderTypes =
  | "azure"
  | "openstack"
  | "vhi"
  | "opc"
  | "opca"
  | "o3c"
  | "oracle_vm"
  | "proxmox"
  | "vmware_vsphere"
  | "aws"
  | "oci"
  | "hyper-v"
  | "scvmm"
  | "olvm"
  | "kubevirt"
  | "harvester"
  | "metal"
  | "rhev"
  | "lxd";

export type Providers = {
  [provider in ProviderTypes]: {
    types: number[];
  };
};

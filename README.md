# cons-helper
Helper for construction engineer estimate


INPUT
  - Don vi: m
  - Do dai cay:
  - Do dai moi doan : 12.3 , 14.5, 20.8
                      45.6 , 11.2

Output
  - SO CAY TOI THIEU CAN DUNG : 11
  - CACH CHIA
     Cach 1
       + 5 * (Moi cay cho L1)
       + 2 * (Moi cay cat thanh 3 * L2)
       + 1 * (Moi cay cat thanh 1 * L2 , 2 L3)
       + 2 * (Moi cay cat thanh 3 L3)
       + 1 * (Moi cay cat thanh 1 L3)
     ==> So doan thua: 3 * 1.2m , 12 * 2.1m
     Cach 2
       + 5 * (Moi cay cho L1)
       + 2 * (Moi cay cat thanh 3 * L2)
       + 1 * (Moi cay cat thanh 1 * L2 , 2 L3)
       + 1 * (Moi cay cat thanh 3 L3)
       + 2 * (Moi cay cat thanh 2 L3)
       ==> So doan thua: 3 * 1.2m , 12 * 2.1m

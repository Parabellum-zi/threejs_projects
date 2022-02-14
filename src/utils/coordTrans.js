/* eslint-disable */
var CoordTrans = CoordTrans || {}
CoordTrans.GaussTransform = {
    ellip_CGCS200: {
        a: 6378137,
        b: 6356752.31414,
        f: 1 / 298.257222101 // f=(a-b)/a
    },
    ProjectionPara: {
        CenterL: 113.2833333333, // 中央经线114
        ZoneWide: 3, // 3度带
        ZoneNo: 38 // 带号
    },
    fourTransPra: {
        scale: 0.999997756396785, // 缩放比例
        rotationAngle: 0.0044099861111111, // 旋转角度
        DX: -199995.893159972, // 北向
        DY: -16.6491077492992 // 东西向
    },
    BL2XY: function(B, L, ellip, Project) {
        var ellip = ellip || CoordTrans.GaussTransform.ellip_CGCS200
        var Project = Project || CoordTrans.GaussTransform.ProjectionPara
        var m_a = ellip.a ? ellip.a : 0
        var m_b = ellip.b ? ellip.b : 0
        var m_f = ellip.f ? ellip.f : 0

        var m_ZoneWide = Project.ZoneWide ? Project.ZoneWide : 3
        var m_ZoneNo = Project.ZoneNo ? Project.ZoneNo : (parseInt(L / m_ZoneWide) + 1)
        var m_CenterL = Project.CenterL ? Project.CenterL : (m_ZoneNo * m_ZoneWide - m_ZoneWide / 2)

        var e = Math.sqrt(2 * m_f - Math.pow(m_f, 2))
        var e2 = e / Math.sqrt(1 - e * e)

        B = CoordTrans.AngleTransform.Degree2Radian(B, false)
        L = CoordTrans.AngleTransform.Degree2Radian(L, false)

        var n2 = Math.pow(e2, 2) * Math.pow(Math.cos(B), 2)
        var t = Math.tan(B)

        var W = Math.sqrt(1 - Math.pow(e * Math.sin(B), 2))
        var M = m_a * (1 - Math.pow(e, 2)) / Math.pow(W, 3) // 子午圈曲率半径
        var N = m_a / W

        var dL = L - CoordTrans.AngleTransform.Degree2Radian(m_CenterL, false) // 经度差(弧度值)
        var l2 = Math.pow(dL, 2) // 经差平方值

        // 计算子午弧长
        var Rx = m_a * (1 - Math.pow(e, 2)) * (1.00505250559297 * B - 0.00253155620900066 * Math.sin(2 * B) + 2.65690155540381E-06 * Math.sin(4 * B) - 3.47007559905787E-09 * Math.sin(6 * B) + 4.91654216666515E-12 * Math.sin(8 * B) - 7.26313725279022E-15 * Math.sin(10 * B) + 1.07400991193683E-17 * Math.sin(12 * B))

        Rx = Rx = m_a * (1 - Math.pow(e, 2)) * (1.00505250559297 * B - 0.00253155620900066 * Math.sin(2 * B) + 2.65690155540381E-06 * Math.sin(4 * B))

        var X = Rx + N * t * Math.pow(Math.cos(B), 2) * l2 * (0.5 + (5 - t * t + 9 * n2 + 4 * Math.pow(n2, 2)) * Math.pow(Math.cos(B), 2) * l2 / 24 + (61 - 58 * t * t + Math.pow(t, 4)) / 720 * Math.pow(Math.cos(B), 4) * Math.pow(l2, 2))

        X = Rx + N * Math.sin(B) * Math.cos(B) * l2 * (0.5 + (5 - t * t + 9 * n2 + 4 * Math.pow(n2, 2)) * Math.pow(Math.cos(B), 2) * l2 / 24 + (61 - 58 * t * t + Math.pow(t, 4)) / 720 * Math.pow(Math.cos(B), 4) * Math.pow(l2, 2))

        var Y = N * Math.cos(B) * dL * (1 + (1 - t * t + n2) * Math.pow(Math.cos(B), 2) * l2 / 6.0 + (5 - 18 * t * t + Math.pow(t, 4) + 14 * n2 - 58 * n2 * t * t) * Math.pow(Math.cos(B), 4) * Math.pow(l2, 2) / 120.0)

        // Y = Y + 500000 + m_ZoneNo * 1000000;
        Y = Y + 500000

        // return { Y, X };
        return { 'X': Y, 'Y': X }

    },
    G2000BLtoGZ2000XYZ: function(B, L, ellip, Project) {
        var point200 = CoordTrans.GaussTransform.BL2XY(B, L, ellip, Project)
        return CoordTrans.GaussTransform.G2000XYtoGZ2000XYZ(point200.X, point200.Y, ellip, Project)
    },
    G2000XYtoGZ2000XYZ: function(X, Y, ellip, Project) {
        var fromPoint = {
            X: X - 460020,
            Y: Y - 2329620
        }
        return CoordTrans.GaussTransform.G2000XYtoGZ2000XYZTransformPoint(fromPoint)
    },

    G2000XYtoGZ2000XYZTransformPoint: function(fromPoint) {
        var tempPoint = {
            X: fromPoint.Y,
            Y: fromPoint.X
        }
        var m_Scale = CoordTrans.GaussTransform.fourTransPra.scale
        var m_RotationAngle = CoordTrans.GaussTransform.fourTransPra.rotationAngle * Math.PI / 180
        var m_DX = CoordTrans.GaussTransform.fourTransPra.DX
        var m_DY = CoordTrans.GaussTransform.fourTransPra.DY

        var A = m_Scale * Math.cos(m_RotationAngle)
        var B = m_Scale * Math.sin(m_RotationAngle)

        var X = A * tempPoint.X - B * tempPoint.Y + m_DX
        var Y = A * tempPoint.Y + B * tempPoint.X + m_DY
        return {
            'X': Y,
            'Y': X + 200000
        }
    },
    GZ2000XYtoG2000XYZTransformPoint: function(X, Y) {
        var fromGZPoint = {
            'X': X,
            'Y': Y
        }

        var tempPoint = {
            'Y': fromGZPoint.X,
            'X': fromGZPoint.Y - 200000
        }
        var m_Scale = CoordTrans.GaussTransform.fourTransPra.scale
        var m_RotationAngle = CoordTrans.GaussTransform.fourTransPra.rotationAngle * Math.PI / 180
        var m_DX = CoordTrans.GaussTransform.fourTransPra.DX
        var m_DY = CoordTrans.GaussTransform.fourTransPra.DY

        var A = m_Scale * Math.cos(m_RotationAngle)
        var B = m_Scale * Math.sin(m_RotationAngle)

        X = (A * tempPoint.X + B * tempPoint.Y - A * m_DX - B * m_DY) / (Math.pow(A, 2) + Math.pow(B, 2))
        Y = (A * tempPoint.Y - B * tempPoint.X + B * m_DX - A * m_DY) / (Math.pow(A, 2) + Math.pow(B, 2))

        return {
            'X': Y,
            'Y': X
        }
    },

    GZ2000XYtoG2000XYZ: function(X, Y, ellip, Project) {
        var fromPoint = CoordTrans.GaussTransform.GZ2000XYtoG2000XYZTransformPoint(X, Y)
        return {
            'X': fromPoint.X + 460020,
            'Y': fromPoint.Y + 2329620
        }
    },
    GZ2000XYtoG2000BL: function(X, Y, ellip, Project) {
        var point200 = CoordTrans.GaussTransform.GZ2000XYtoG2000XYZ(X, Y, ellip, Project)
        return CoordTrans.GaussTransform.XY2BL(point200.X, point200.Y, ellip, Project)
    },

    XY2BL: function(X, Y, ellip, Project) {
        var m_X = Y
        var m_Y = X
        var ellip = ellip || CoordTrans.GaussTransform.ellip_CGCS200
        var Project = Project || CoordTrans.GaussTransform.ProjectionPara
        var m_a = ellip.a ? ellip.a : 0 // 长半轴
        var m_b = ellip.b ? ellip.b : 0
        var m_f = ellip.f ? ellip.f : 0 // 扁率
        var e = Math.sqrt(2 * m_f - Math.pow(m_f, 2)) // 第一偏心率
        var e2 = e / Math.sqrt(1 - e * e) // 第二偏心率
        // 弧长参数
        var m_r1 = 1 + 0.75 * Math.pow(e, 2) + 45.0 / 64 * Math.pow(e, 4) + 175.0 / 256 * Math.pow(e, 6) + 11025.0 / 16384 * Math.pow(e, 8) + 43659.0 / 65536 * Math.pow(e, 10) + 693693.0 / 1048576 * Math.pow(e, 12)

        var m_r2 = 3.0 / 8 * Math.pow(e, 2) + 15.0 / 32 * Math.pow(e, 4) + 525.0 / 1024 * Math.pow(e, 6) + 2205.0 / 4096 * Math.pow(e, 8) + 72765.0 / 131072 * Math.pow(e, 10) + 297297.0 / 524288 * Math.pow(e, 12)

        var m_r3 = 15.0 / 256 * Math.pow(e, 4) + 105.0 / 1024 * Math.pow(e, 6) + 2205.0 / 16384 * Math.pow(e, 8) + 10395.0 / 65536 * Math.pow(e, 10) + 1486485.0 / 8388608 * Math.pow(e, 12)

        var m_r4 = 35.0 / 3072 * Math.pow(e, 6) + 105.0 / 4096 * Math.pow(e, 8) + 10395.0 / 262144 * Math.pow(e, 10) + 55055.0 / 1048576 * Math.pow(e, 12)

        var m_r5 = 315.0 / 131072 * Math.pow(e, 8) + 3465.0 / 524288 * Math.pow(e, 10) + 99099.0 / 8388608 * Math.pow(e, 12)

        var m_r6 = 693.0 / 1310720 * Math.pow(e, 10) + 9009.0 / 5242880 * Math.pow(e, 12)

        var m_r7 = 1001.0 / 8388608 * Math.pow(e, 12)

        var A1 = m_a * (1 - Math.pow(e, 2)) * m_r1 * Math.PI / 180 // 乘弧长参数1
        var A2 = m_a * (1 - Math.pow(e, 2)) * m_r2 // 乘弧长参数2
        var A3 = m_a * (1 - Math.pow(e, 2)) * m_r3 // 乘弧长参数3
        var A4 = m_a * (1 - Math.pow(e, 2)) * m_r4 // 乘弧长参数4

        var B0 = m_X / A1
        var preB0 = 0
        /** ************************************
         * 底点纬度迭代算法
         * 求B
         * **************************************/
        do {
            preB0 = B0
            B0 = B0 * Math.PI / 180
            B0 = (m_X - (-A2 * Math.sin(2 * B0) + A3 * Math.sin(4 * B0) - A4 * Math.sin(6 * B0))) / A1
            if (Math.abs(B0 - preB0) < 0.0000001) break

        } while (true)

        B0 = B0 * Math.PI / 180

        var n2 = Math.pow(e2, 2) * Math.pow(Math.cos(B0), 2)
        var t = Math.tan(B0)

        var W = Math.sqrt(1 - Math.pow(e * Math.sin(B0), 2)) // 第一辅助参数
        var M = m_a * (1 - Math.pow(e, 2)) / Math.pow(W, 3) // 子午圈曲率半径
        var N = m_a / W // 卯酉圈曲率半径

        m_Y = m_Y % 1000000 - 500000 // 减去带号--减去偏移值
        var ly = m_Y / N

        var m_ZoneWide = Project.ZoneWide ? Project.ZoneWide : 3
        var m_ZoneNo = Project.ZoneNo ? Project.ZoneNo : (parseInt(L / m_ZoneWide) + 1)
        var m_CenterL = Project.CenterL ? Project.CenterL : (m_ZoneNo * m_ZoneWide - m_ZoneWide / 2)

        var centerL0 = CoordTrans.AngleTransform.Degree2Radian(m_CenterL, false) // 度转换弧度

        var tempL = centerL0 + (ly - (1 + 2 * t * t + n2) * Math.pow(ly, 3) / 6 + (5 + 28 * t * t + 24 * Math.pow(t, 4) + 6 * n2 + 8 * n2 * Math.pow(t, 2)) * Math.pow(ly, 5) / 120) / Math.cos(B0)
        // 以百分制形式返回经度
        var L = Math.round(CoordTrans.AngleTransform.Radian2Degree(tempL, false) * 100000000000) / 100000000000

        var tempB = B0 - t / (2 * M) * m_Y * ly * (1 - (5 + 3 * t * t + n2 - 9 * n2 * Math.pow(t, 2)) * Math.pow(ly, 2) / 12 + (61 + 90 * t * t + 45 * Math.pow(t, 4)) * Math.pow(ly, 4) / 360)
        // 以百分制形式返回纬度
        var B = Math.round(CoordTrans.AngleTransform.Radian2Degree(tempB, false) * 100000000000) / 100000000000
        return { B, L }
    },

    gcj02toG2000: function(lng, lat) {
        var math = Math, pi = Math.PI
        var transformlat = function(lng, lat) {
            let ret
            ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
            ret += (20.0 * Math.sin(6.0 * lng * pi) + 20.0 *
                Math.sin(2.0 * lng * pi)) * 2.0 / 3.0
            ret += (20.0 * Math.sin(lat * pi) + 40.0 *
                Math.sin(lat / 3.0 * pi)) * 2.0 / 3.0
            ret += (160.0 * Math.sin(lat / 12.0 * pi) + 320 *
                Math.sin(lat * pi / 30.0)) * 2.0 / 3.0
            return ret

        }

        var transformlng = function(lng, lat) {
            let ret
            ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * math.sqrt(math.abs(lng))
            ret += (20.0 * math.sin(6.0 * lng * pi) + 20.0 *
                math.sin(2.0 * lng * pi)) * 2.0 / 3.0
            ret += (20.0 * math.sin(lng * pi) + 40.0 *
                math.sin(lng / 3.0 * pi)) * 2.0 / 3.0
            ret += (150.0 * math.sin(lng / 12.0 * pi) + 300.0 *
                math.sin(lng / 30.0 * pi)) * 2.0 / 3.0
            return ret
        }

        // if out_of_china(lng, lat):
        // return lng, lat

        var ellip_cgcs2000 = CoordTrans.GaussTransform.ellip_CGCS200
        var a = ellip_cgcs2000.a, ee = ellip_cgcs2000.f * 2

        var dlat, dlng, radlat, magic, mglat, mglng, sqrtmagic
        dlat = transformlat(lng - 105.0, lat - 35.0)
        dlng = transformlng(lng - 105.0, lat - 35.0)
        radlat = lat / 180.0 * pi
        magic = math.sin(radlat)
        magic = 1 - ee * magic * magic
        sqrtmagic = math.sqrt(magic)
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * pi)
        dlng = (dlng * 180.0) / (a / sqrtmagic * math.cos(radlat) * pi)
        mglat = lat + dlat
        mglng = lng + dlng
        return [lng * 2 - mglng, lat * 2 - mglat]
    },

    // 百度坐标 to gcj02
    bd09togcj02: function(bd_lon, bd_lat) {
        var x_PI = 3.14159265358979324 * 3000.0 / 180.0
        var bd_lon = +bd_lon
        var bd_lat = +bd_lat
        var x = bd_lon - 0.0065
        var y = bd_lat - 0.006
        var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_PI)
        var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_PI)
        var gg_lng = z * Math.cos(theta)
        var gg_lat = z * Math.sin(theta)
        return [gg_lng, gg_lat]
    }

}
CoordTrans.AngleTransform = {

    Degree2Radian: function(dbld, isDDFFMM) {
        if (isDDFFMM) {
            dbld = Ang60ToAng100(dbld)
        }
        var dr = dbld * Math.PI / 180
        return dr

    },
    Ang60ToAng100: function(dfmAng) {
        var allms
        allms = Ang2Ms(dfmAng)
        return Math.round()
    },
    Radian2Degree: function(dblR, dfmformat) {
        var dAng
        dAng = dblR * 180 / Math.PI
        if (dfmformat == true) {
            dAng = Ang100ToAng60(dAng)
        }
        return dAng
    }

}

export default CoordTrans

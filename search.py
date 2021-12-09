import os
import pandas as pd
import numpy as np
from tslearn.preprocessing import TimeSeriesScalerMinMax
from tslearn.utils import to_time_series_dataset
import itertools
import time

# 入力と各動作のDTW距離を算出
def calculateDtw(inputX, inputY, threshold, splittedDataPath, savePath):
    # 検索対象ファイルの数確認
    fileLen = 0
    for pathName, dirName, fileNames in os.walk(splittedDataPath):
        fileLen = len(fileNames)
        for fileName in fileNames:
            if fileName.startswith("."):
                fileLen -= 1

    # 入力の整形
    inputData = []
    for i in range(len(inputX)):
        inputData.append(inputX[i])
        inputData.append(inputY[i])    
    inputData = np.array(inputData)
    inputData = inputData.reshape(len(inputX), 2)
        
    # 1動作のcsvを読み込み，配列に保持（配列のインデックス=動作番号）
    splittedData = []
    prjIds = []
    for i in range(fileLen):
        splittedData.insert(i, pd.read_csv(splittedDataPath + "/" + str(i) + ".csv", usecols=["x", "y"]).values)
        prjIds.insert(i, pd.read_csv(splittedDataPath + "/" + str(i) + ".csv", usecols=["prjId"]).values[0])
            
        # データの正規化(0~1)
        splittedData[i] = TimeSeriesScalerMinMax().fit_transform(to_time_series_dataset([splittedData[i]])).flatten().reshape(-1, 2)

    # count = 0
    # start = time.time()
   
    # 各動作ごとにDTW距離を算出
    dtwResults = pd.DataFrame(columns=["prjId", "moveNum", "dtw"])   
    for i in range(fileLen):
        dtwVal = dtw(inputData, splittedData[i])[1]
        addRow = pd.DataFrame([[str(prjIds[i]), str(i), dtwVal]], columns=["prjId", "moveNum", "dtw"])
        dtwResults = dtwResults.append(addRow)

    dtwResults.sort_values("dtw").to_csv(savePath + "/results.csv")

# DTW距離を算出
def dtw(x, y):
    # xのデータ数，yのデータ数をそれぞれTx,Tyに代入
    Tx = len(x)
    Ty = len(y)
    
    # C:各マスの累積コスト，　B：最小コストの行/列番号
    C = np.zeros((Tx, Ty))
    B = np.zeros((Tx, Ty, 2), int)
    
    # 一番初めのマスのコストを，xとyのそれぞれ一番初めの値にする
    C[0, 0] = dist(x[0], y[0])
    
    # 動的計画法を用いる
    # 左下のマスからスタートし，各マスに到達するため最小の累積コストを1マスずつ求める
    
    # 境界条件：両端が左下と右上にあること
    # 単調性：左下から始まり，右，上，右上のいずれかにしか進まないこと
    # 連続性：繋がっていること
    
    # 一番下の行は，真っ直ぐ右にコストが累積される
    for i in range(Tx):
        C[i, 0] = C[i - 1, 0] + dist(x[i], y[0])
        B[i, 0] = [i - 1, 0]
        
    # 同様に一番左の列は，真っ直ぐ上にコストが累積される
    for j in range(1, Ty):
        C[0, j] = C[0, j - 1] + dist(x[0], y[j])
        B[0, j] = [0, j - 1]
        
    # その他のマスの累積コストを求める
    for i in range(1, Tx):
        for j in range(1, Ty):
            pi, pj, m = get_min(C[i - 1, j],
                                C[i, j - 1],
                                C[i - 1, j - 1],
                                i, j)
            # get_minで返ってきた最小コストを累積コストに足す
            C[i, j] = dist(x[i], y[j]) + m
            # get_minで返ってきた最小コストの行/列番号を保持
            B[i, j] = [pi, pj]
    # 最終的な右上（最終の到達点）のコスト
    cost = C[-1, -1]
    
    path = [[Tx - 1, Ty - 1]]
    
    # 逆順にたどることでパスを求める
    i = Tx - 1
    j = Ty - 1
    
    while((B[i, j][0] != 0) or (B[i, j][1] != 0)):
        path.append(B[i, j])
        i, j = B[i, j].astype(int)
    path.append([0, 0])
    return np.array(path), cost, C

# 距離算出
def dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

# 最小値算出
def get_min(m0, m1, m2, i, j):
    if m0 < m1:
        if m0 < m2:
            return i - 1, j, m0
        else:
            return i - 1, j - 1, m2
    else:
        if m1 < m2:
            return i, j - 1, m1
        else:
            return i - 1, j - 1, m2

x = [49, 50, 152, 316, 371, 395, 391, 271, 183, 121]
y = [162, 300, 308, 319, 311, 174, 83, 71, 60, 62]
calculateDtw(x, y, 0, "/Users/yuki-f/scratchsearch/splitted", "/Users/yuki-f/scratchsearch")